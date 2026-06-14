 /* nav */
$(".openbtn1").click(function () {//ボタンがクリックされたら
  $(this).toggleClass('active');//ボタン自身に activeクラスを付与し
    $("#g-nav").toggleClass('panelactive');//ナビゲーションにpanelactiveクラスを付与
    $(".circle-bg").toggleClass('circleactive');//丸背景にcircleactiveクラスを付与
});

$("#g-nav a").click(function () {//ナビゲーションのリンクがクリックされたら
    $(".openbtn1").removeClass('active');//ボタンの activeクラスを除去し
    $("#g-nav").removeClass('panelactive');//ナビゲーションのpanelactiveクラスを除去
    $(".circle-bg").removeClass('circleactive');//丸背景のcircleactiveクラスを除去
});





 /* box 切り替え */
 function showContent(contentId, button) {
  var contents = document.querySelectorAll('.content-box');
  contents.forEach(function(content) {
      content.classList.add('hidden');
      content.classList.remove('visible');
  });
  var selectedContent = document.getElementById(contentId);
  selectedContent.classList.remove('hidden');
  setTimeout(function() {
      selectedContent.classList.add('visible');
  }, 10); // 少し遅延を入れてアニメーションをトリガー

  var buttons = document.querySelectorAll('.button');
  buttons.forEach(function(btn) {
      btn.classList.remove('active');
  });
  button.classList.add('active');
}




const slides = document.querySelector('.slides');
        const slideCount = document.querySelectorAll('.slide').length;
        let currentIndex = 0;

        document.getElementById('next').addEventListener('click', () => {
            if (currentIndex < slideCount - 1) {
                currentIndex++;
                slides.style.transform = `translateX(-${currentIndex * 400}px)`;
            }
        });

        document.getElementById('prev').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                slides.style.transform = `translateX(-${currentIndex * 400}px)`;
            }
        });

/* slider */
/* let currentIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }
    document.querySelector('.slides').style.transform = `translateX(-${currentIndex * 100}%)`;
}

function moveSlide(step) {
    showSlide(currentIndex + step);
}

setInterval(() => {
    moveSlide(1);
}, 3000);

showSlide(currentIndex);
 */