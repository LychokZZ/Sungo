document.addEventListener('DOMContentLoaded', function () {
    // Відновлюємо збережені дані при завантаженні сторінки
    loadMoviesFromLocalStorage();

    document.getElementById('add-movie-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Отримуємо введену назву фільму та обрану категорію
        const movieName = document.getElementById('movie-name').value;
        const category = document.getElementById('category').value;

        // Створюємо новий елемент списку
        const newMovieItem = createMovieItem(movieName);

        // Додаємо фільм у відповідний список категорії
        const movieList = document.getElementById(category).querySelector('.movie-list');
        movieList.appendChild(newMovieItem);

        // Очищаємо поле вводу після додавання
        document.getElementById('movie-name').value = '';

        // Оновлюємо localStorage
        saveMoviesToLocalStorage();
    });
});

// Створення нового елемента списку з подією для переміщення до переглянутого
function createMovieItem(movieName) {
    const newMovieItem = document.createElement('li');
    newMovieItem.textContent = movieName;

    // Додаємо можливість клацати на фільм для переміщення в "Переглянуте"
    newMovieItem.addEventListener('click', function () {
        markAsWatched(newMovieItem);
    });

    return newMovieItem;
}

// Функція для переміщення фільму в блок "Медіа, яке переглянули"
function markAsWatched(movieItem) {
    // Зачеркуємо текст
    movieItem.style.textDecoration = 'line-through';

    // Затримка, щоб показати користувачу, що фільм був зачеркнутий
    setTimeout(function () {
        // Видаляємо фільм з поточного блоку
        movieItem.remove();

        // Додаємо фільм у блок "Медіа, яке переглянули"
        const watchedList = document.getElementById('watched').querySelector('.movie-list');
        watchedList.appendChild(movieItem);

        // Прибираємо зачеркування
        movieItem.style.textDecoration = 'none';

        // Оновлюємо localStorage
        saveMoviesToLocalStorage();
    }, 500); // затримка 0.5 секунди перед переміщенням
}

// Функція для збереження всіх фільмів у localStorage
function saveMoviesToLocalStorage() {
    const categories = ['films', 'series', 'shows', 'cartoons', 'watched'];
    const moviesData = {};

    categories.forEach(function (category) {
        const movieList = document.getElementById(category).querySelector('.movie-list');
        const movies = Array.from(movieList.querySelectorAll('li')).map(li => li.textContent);
        moviesData[category] = movies;
    });

    localStorage.setItem('movies', JSON.stringify(moviesData));
}

// Функція для завантаження фільмів із localStorage
function loadMoviesFromLocalStorage() {
    const savedMovies = JSON.parse(localStorage.getItem('movies'));

    if (savedMovies) {
        const categories = ['films', 'series', 'shows', 'cartoons', 'watched'];

        categories.forEach(function (category) {
            const movieList = document.getElementById(category).querySelector('.movie-list');
            movieList.innerHTML = ''; // Очищаємо поточний список перед додаванням

            savedMovies[category].forEach(function (movieName) {
                const movieItem = createMovieItem(movieName);
                movieList.appendChild(movieItem);
            });
        });
    }
}

document.getElementById('clear-storage').addEventListener('click', function () {
    // Очищаємо localStorage
    localStorage.clear();

    // Очищаємо всі списки медіа на сторінці
    document.querySelectorAll('.movie-list').forEach(function (list) {
        list.innerHTML = '';
    });

    // Перезавантажуємо сторінку
    location.reload();
});
