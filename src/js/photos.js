// Фото нашего кота Барсика для экрана «Молодец!» (результат 90% и выше).
// Чтобы добавить фото: положи jpg в src/assets/ (сжатый, ~500 px, без метаданных) и допиши импорт в список.
import photo1 from "../assets/cat-photo-1.jpg";
import photo2 from "../assets/cat-photo-2.jpg";
import photo3 from "../assets/cat-photo-3.jpg";

export const CAT_PHOTOS = [photo1, photo2, photo3];
export const randomCatPhoto = () => CAT_PHOTOS[Math.floor(Math.random() * CAT_PHOTOS.length)];
