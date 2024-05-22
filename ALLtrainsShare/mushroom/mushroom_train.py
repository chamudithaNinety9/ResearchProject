import os
import glob
import cv2 as cv
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report

train_dataset_dir = 'data/train'
test_dataset_dir = 'data/test'

width = 224
height = 224
test_split = 0.25
validation_split = 0.25

target_size = (width, height)
input_shape = (width, height, 3)

def create_test_split(train_dataset_dir, test_dataset_dir, test_split):
    if not os.path.exists(test_dataset_dir):
        os.makedirs(test_dataset_dir)
    for class_name in os.listdir(train_dataset_dir):
        class_dir = os.path.join(train_dataset_dir, class_name)
        test_class_dir = os.path.join(test_dataset_dir, class_name)
        if not os.path.exists(test_class_dir):
            os.makedirs(test_class_dir)
        images = glob.glob(os.path.join(class_dir, '*.*'))
        test_size = int(len(images) * test_split)
        test_images = np.random.choice(images, test_size, replace=False)
        for image in test_images:
            os.rename(image, image.replace('train', 'test'))

def preprocessing_function(img):
    img = tf.keras.applications.xception.preprocess_input(img)
    return img

def image_data_generator():
    train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        rotation_range=30,
        shear_range=0.3,
        zoom_range=0.3,
        width_shift_range=0.3,
        height_shift_range=0.3,
        horizontal_flip=True,
        vertical_flip=True,
        validation_split=validation_split,
        preprocessing_function=preprocessing_function
    )

    test_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        preprocessing_function=preprocessing_function
    )

    train_generator = train_datagen.flow_from_directory(
        train_dataset_dir,
        target_size=target_size,
        color_mode='rgb',
        batch_size=8,
        class_mode='sparse',
        subset='training',
        shuffle=True
    )

    validation_generator = train_datagen.flow_from_directory(
        train_dataset_dir,
        target_size=target_size,
        color_mode='rgb',
        batch_size=8,
        class_mode='sparse',
        subset='validation',
        shuffle=True
    )

    test_generator = test_datagen.flow_from_directory(
        test_dataset_dir,
        target_size=target_size,
        color_mode='rgb',
        batch_size=8,
        class_mode='sparse',
        shuffle=False
    )

    return train_generator, validation_generator, test_generator

train_generator, validation_generator, test_generator = image_data_generator()

def mushroom_defect_detector():
    inputs = tf.keras.Input(shape=input_shape)

    x = tf.keras.layers.Conv2D(32, (3, 3), activation='relu')(inputs)
    x = tf.keras.layers.MaxPooling2D((2, 2))(x)

    x = tf.keras.layers.Conv2D(64, (3, 3), activation='relu')(x)
    x = tf.keras.layers.MaxPooling2D((2, 2))(x)

    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(128, activation='relu')(x)

    outputs = tf.keras.layers.Dense(3, activation='softmax')(x)

    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    model.summary()

    return model

model = mushroom_defect_detector()
def create_transfer_model():
    base_model = tf.keras.applications.Xception(weights='imagenet', include_top=False, input_shape=input_shape)
    for layer in base_model.layers:
        layer.trainable = False
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(11, activation='softmax')  
    ])

    model.summary()

    return model

model = create_transfer_model()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    steps_per_epoch=train_generator.samples // train_generator.batch_size,
    validation_steps=validation_generator.samples // validation_generator.batch_size,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
    ],
    epochs=100
)

if not os.path.exists('models/mushroomNew-detector.h5'):
    model.save('models/mushroomNew-detector.h5')

class_dict = train_generator.class_indices
class_dict_rev = {v: k for k, v in class_dict.items()}
print(class_dict, class_dict_rev)

def load_dataset():
    train_image_paths = glob.glob(os.path.join(train_dataset_dir, '*/*'))
    test_image_paths = glob.glob(os.path.join(test_dataset_dir, '*/*'))
    all_image_paths = train_image_paths + test_image_paths
    all_image_paths = [x.replace('\\', '/') for x in all_image_paths]
    np.random.shuffle(all_image_paths)

    X = np.zeros((len(all_image_paths), width, height, 3), dtype='float32')
    y = np.zeros(len(all_image_paths), dtype='float32')

    for i, file_path in enumerate(all_image_paths):
        img = cv.imread(file_path)
        img = cv.resize(img, target_size)
        img = preprocessing_function(img)
        X[i] = img

        _, _, class_folder, _ = file_path.split('/')
        y[i] = class_dict[class_folder]

    return X, y

X, Y = load_dataset()

with tf.device('/GPU:0'):
    P = model.predict(X)
predicted_labels = np.argmax(P, axis=1)

final_accuracy = history.history['accuracy'][-1]
final_loss = history.history['loss'][-1]

print("Final Accuracy:", final_accuracy)
print("Final Loss:", final_loss)
print("========== Classification Report ==========")
print(classification_report(Y, predicted_labels, target_names=class_dict_rev.values()))

