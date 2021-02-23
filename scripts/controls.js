const mainMenuLi = document.querySelectorAll('.main-menu li'),
    backLink = document.querySelector('.back-link p'),
    content = document.querySelector('.content');

let backLinkWidth = backLink.getBoundingClientRect().width;
//Кнопка "назад" за экраном
backLink.style.transform = `translateX(${-backLinkWidth * 2}px)`;


let contentStyleTop = innerHeight * 0.8; //Высота блока контента, когда он видим

let backLinkLeft; //переменная для передачи в аниме джэс
let mainMenuLiStyle; //переменная для передачи в аниме джэс


if (innerWidth <768) {
    backLinkLeft = (innerWidth * 0.5) - (backLinkWidth); //вычисляем положение кнопки "назад" на мобильных устройствах и передаём в аниме.js
    mainMenuLi.forEach(item => {
        mainMenuLiStyle = innerWidth * 0.5 - item.getBoundingClientRect().width;
        item.style.transform = `translateX(${mainMenuLiStyle}px)`;
        content.style.width = innerWidth * 0.9 + 'px';
        content.style.height = innerHeight * 0.75 + 'px';
        return contentStyleTop = innerHeight * 0.78; //Высота блока контента, когда он видим
    });
} else if(innerWidth >=768) {
    backLinkLeft = innerWidth * .05
    mainMenuLi.forEach(item => {
        item.style.transform = `translateX(${innerWidth * .05}px`;
        mainMenuLiStyle = innerWidth * .05;
    });
    //Контейнер контента определяем стили для блока и библиотеки аниме джес

    content.style.width = innerWidth * 0.8 + 'px';
    content.style.height = innerHeight * 0.75 + 'px';

}


const showContent = () => {
    anime({
        targets: '.main-menu li',
        translateX: -400,
        delay: function(el, i, l) {
            return (l - i)* 100;
        },
    });
    anime({
        targets: '.content',
        translateY: -contentStyleTop,
        easing: 'easeInOutSine',
        duration: 500

    });
    anime({
        targets: '.back-link p',
        translateX: backLinkLeft,

    });
};
const hideContent = () => {
    anime({
        targets: '.main-menu li',
        translateX: mainMenuLiStyle,
        delay: function(el, i, l) {
            return i * 100;
        },
    });
    anime({
        targets: '.back-link p',
        translateX: -250,

    });
    anime({
        targets: '.content',
        translateY: 870,
        easing: 'easeInOutSine',
        duration: 500

    });
}

mainMenuLi.forEach(item => {
    item.addEventListener('click', showContent)
});
backLink.addEventListener('click', hideContent);
