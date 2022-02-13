'use strict';

//-----------------------------------------
// Вызов модального окна "Связаться"
//-----------------------------------------
const btnOpen = document.querySelector('.slider__modal-btn');
const btnClose = document.querySelector('.modal__close-btn');
const modal = document.querySelector('.modal'); // оверлей с затемнением фона позади модального окна
const modalWindow = document.querySelector('.modal__wrap'); // контентный блок модального окна

const animateIn = () => {
	modalWindow.classList.remove('modal-in');
	modalWindow.removeEventListener('animationend', animateIn);
};

/* Нижеследующая функция вызывается при нажатии кнопки btnOpen, отвечающей за открытие модального окна.
  Вызванная нажатием этой кнопки функции производит последовательно 3 действия:
  -- вызывается слушатель событий на объекте modalWindow, который ждёт когда на объекте закончится анимация;
  -- оверлею модального окна задаётся класс .modal--open который вызывает появление модального окна;
  -- контентному блоку модального окна задаётся класс modal-in, который вызывает вышеупомянутую анимацию.
  Как только анимация объекта modalWindow закончится eventListener вызовет функцию коллбэк animateIn.
  Функция animateIn код которой выше удалит уже не нужный класс modal-in, а также слушатель анимации, 
  чтобы анимация могла сработать повторно.
*/
const modalOpenHandler = () => {
	modalWindow.addEventListener('animationend', animateIn);
	modal.classList.add('modal--open');
	modalWindow.classList.add('modal-in');
};

//----------------------------------------------------------
const animateOut = () => {
	modalWindow.classList.remove('modal-out');
	modal.classList.remove('modal--open');
	modalWindow.removeEventListener('animationend', animateOut);
};

/* Нижеследующая функция вызывается при нажатии кнопки btnClose, отвечающей за удаление модального окна.
  Вызванная нажатием этой кнопки функция вызывает слушатель окончания анимации, а также добавляет
  класс объекту modalWindow, который и вызывает анимацию. По окончании анимации слушатель вызывает 
  коллбэк функцию animateOut, которая удаляет уже не нужные классы .modal-out а также класс .modal--open,
  что приводит к окончательному закрытию модального окна вместе с оверлеем. Сам слушатель также удаляется
  для того чтобы анимация могла сработать повторно */
const modalCloseHandler = () => {
	modalWindow.addEventListener('animationend', animateOut);
	modalWindow.classList.add('modal-out');
};

btnOpen.addEventListener('click', modalOpenHandler);
btnClose.addEventListener('click', modalCloseHandler);

//-----------------------------------------
// Вызов меню навигации
//-----------------------------------------
const menuNav = document.querySelector('.menu__nav');
const burgerBtn = document.querySelector('.burger');

// burgerBtn.onclick = () => {
//   menu.classList.toggle('menu--open');
// }
burgerBtn.addEventListener('click', () => {
	menuNav.classList.toggle('menu--open');
	burgerBtn.classList.toggle('menu--open');

  // При открытом меню убераем вертикльную полосу прокрутки.
  // Иначе логотип и бургер-кнопка уедут за пределы экран при скролле.
  if (menuNav.classList.contains('menu--open')) {
    document.body.setAttribute('style', 'overflow: hidden');
  } else document.body.removeAttribute('style');
});

//--------------------------------------------
// Фиксированное меню навигации
//--------------------------------------------
const header = document.querySelector('.header'); // нашли хедер
const mainNav = header.querySelector('.header__wrapper'); // внутри хедера нашли блок с навигацией
const backScrolledHeader = header.querySelector('.header__backscrolled'); // и нашли дополнительный блок
const scrolledHeaderStart = header.offsetHeight; // сохранили высоту хедера в константу
let scrollStarted = 0; // переменная для определения направления скролла - вверх или вниз.

// слушаем событие скролла на окне браузера и при скролле вызываем функцию-коллбэк
window.addEventListener('scroll', headerScrollHandler);


function headerScrollHandler () {
	// записываем величину текущего скролла в константу
	const scrollTop = window.pageYOffset; 
	// сохраняем разницу значений предыдущей и текущей прокрутки. Если delta меньше нуля, прокрутка сделана вверх.
	const delta = scrollTop - scrollStarted; 

	/* как только высота прокрутки страницы сравняется с высотой хедера, 
     навигация появится вверху экрана за счёт добавления класса header__nav--fixed */
	if (scrollTop >= scrolledHeaderStart) {
		mainNav.classList.add('header__nav--fixed');
		header.style.marginBottom = `${mainNav.offsetHeight}px`;
	} else {
		mainNav.classList.remove('header__nav--fixed');
		header.style.marginBottom = `0px`;
	}

	if ((delta < 0) && (scrollTop >= scrolledHeaderStart)) {
    backScrolledHeader.classList.add('header__backscrolled--show');
  } else {
    backScrolledHeader.classList.remove('header__backscrolled--show');
  }
	scrollStarted = scrollTop;

};

//--------------------------------------------
// Слайдер
//--------------------------------------------
const sliderBox = document.querySelector(".slider");
const slides = sliderBox.querySelectorAll('.slider__item');
const btnPrev = sliderBox.querySelector('.slider__btn--prev');
const btnNext = sliderBox.querySelector('.slider__btn--next');

let counter = 0;
let maxStep = slides.length - 1;
slides[counter].classList.add('slider__item--current');

// Блокируем кнопку НАЗАД если текущий элемент первый
function isFirst(counter) {
	if (counter === 0) {
		btnPrev.setAttribute('disabled', 'disabled');
	} else {
		btnPrev.removeAttribute('disabled', 'disabled');
	}
}

// Блокируем кнопку ВПЕРЁД если текущий элемент последний
function isLast(counter) {
	if (counter === maxStep) {
		btnNext.setAttribute('disabled', 'disabled');
	} else {
		btnNext.removeAttribute('disabled', 'disabled');
	}
}

function nextBtnHandler() {
	slides[counter].classList.remove('slider__item--current');
	// Добавляем инлайновые стили, чтобы предыдущий элемент оставался на месте.
	slides[counter].setAttribute('style', 'transform: translate(0%)');
	counter++;
	isLast(counter);
	isFirst(counter);
	slides[counter].classList.add('slider__item--current');
}

function prevBtnHandler() {
	slides[counter].classList.remove('slider__item--current');
	counter--;
	isLast(counter);
	isFirst(counter);
	slides[counter].classList.add('slider__item--current');
	// Убираем инлайновые стили, чтобы данный элемент мог уехать за пределы экрана,
	// если мы продолжим листать в обратном порядке.
	slides[counter].removeAttribute('style');
}

btnNext.addEventListener('click', nextBtnHandler);
btnPrev.addEventListener('click', prevBtnHandler);

//---------------------------------------------------
// Переключение слайдера с бесконечной прокруткой.
//---------------------------------------------------
/*
btnNext.addEventListener('click', () => {
  slides[counter].classList.remove('slider__item--current');
  counter++;
  // для слайдера с бесконечной прокруткой сбрасываем счётчик
  // до нуля, когда он доходит до последнего элемента.
  if (counter >= slides.length) counter = 0; 
  slides[counter].classList.add('slider__item--current');
});

btnPrev.addEventListener('click', () => {
  slides[counter].classList.remove('slider__item--current');
  counter--;
  // для слайдера с бесконечной прокруткой увеличиваем счётчик,
  // на максимум, если он становится меньше нуля.
  if (counter < 0) counter = slides.length - 1; 
  slides[counter].classList.add('slider__item--current');
});
*/

//--------------------------------------------------------
// Табы
//--------------------------------------------------------

const tabLinks = document.querySelectorAll('.tabs__link');
const tabContents = document.querySelectorAll('.tab-content__item');

// Для каждой кнопки устанавливаем слушатель событий, 
// который при клике на кнопку будет вызвать функцию openTabs.
tabLinks.forEach(function (element) {
	element.addEventListener('click', openTabs);
});


function openTabs(evt) {
  // Находим кнопку на которой произошло событие клика и записываем её в константу
	const btnTarget = evt.currentTarget;
  // У найденной кнопку получаем данные записанные в её атрибуте data-
	const work = btnTarget.dataset.work;

  // Удаляем "активные" классы у всех кнопок и блоков контента,
  // для того чтобы была только одна активная вкладка, а не все одновременно.
	tabContents.forEach(function (item) {
		item.classList.remove('tab-content__item--active');
	});
	tabLinks.forEach(function (item) {
		item.classList.remove('tabs__link--active');
	});

  // Находим по id контент соответствующий значению атрибута дата той кнопки, по которой кликнули
  // Самой кнопке также навешиваем класс определяющий её стили в выбранном состоянии
	document.querySelector(`#${work}`).classList.add('tab-content__item--active');
	btnTarget.classList.add('tabs__link--active');
}

/* 
Event.currentTarget - определяет элемент, в котором в данный момент обрабатывается событие. 
Всегда совпадает элементом, на котором обработчик события был назначен, 
в отличие от свойства event.target, идентифицирующего элемент, на котором событие возникло. */

//--------------------------------------------------------
// Аккордеон
//--------------------------------------------------------

const titles = document.querySelectorAll('.faq__question');
let current = null;

// Функция включает/отключает дополнительный класс и раскрывает контентную часть
const toggleItem = (title) => {
	title.classList.toggle('faq__question--open');

	const content = title.nextElementSibling;
	if (content.style.maxHeight) {
		content.style.maxHeight = null;
	} else {
		content.style.maxHeight = content.scrollHeight + 'px';
	}
};

// В цикле перебираем все кнопки-заголовки и на каждую вешаем слушатель события клика.
for (let i = 0; i < titles.length; i++) {
	titles[i].addEventListener('click', function () {
		// код сработает при повторном клике по уже открытому элементу аккордеона
		if (titles[i] === current) {
			toggleItem(current);
			current = null;
			return;
		}
		// код приведёт к закрытию уже открытого аккордеона, при открытие другого аккордеона.
		if (current) {
			toggleItem(current);
		}
		// В исходном состоянии, когда все элементы закрыты, срабатывает ниже следующая часть кода.
		// Вызывается функция активирующая раскрытие элемента аккордеона, а в переменную записывается
		// кнопка под которой произошло открытие контента, благодаря этому становится возможной работа
		// вышерасположенных условий.
		toggleItem(titles[i]);
		current = titles[i];
	});
}
