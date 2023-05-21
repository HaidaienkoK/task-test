import axios from 'axios';
import LoadMoreBtn from './components/LoadMoreBtn.js';

const cardsContainer = document.querySelector('.cards');
let storageData = localStorage.getItem('Data');
let cardsData = '';
let i = 0;
let firstCardPage = 0;
let endCardPages = 2;
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

loadMoreBtn.button.addEventListener('click', onLoadMore);

async function fetchData() {
  try {
    const response = await axios.get(
      'https://6457709a1a4c152cf981ff55.mockapi.io/DDsd'
    );
    cardsData = response.data;
    var jsonString = JSON.stringify(cardsData);
    localStorage.setItem('Data', jsonString);
    renderCards(cardsData);
    const buttonElAll = document.querySelectorAll('.button');
    buttonElAll.forEach(function (item) {
      item.addEventListener('click', clickItem);
    });
  } catch (error) {
    console.log(error);
  }
}

function onLoadMore() {
  renderCards(cardsData);
}

function renderCards(cardsData) {
  cardsContainer.innerHTML = '<ul class="cards"></ul>';
  if (cardsData.length <= endCardPages) {
    endCardPages = cardsData.length - 1;
    loadMoreBtn.hide();
  }
  for (i = firstCardPage; i <= endCardPages; i++) {
    const markup = `<li class="card">
        <div class="box">
       <div class="logo"></div>
          <div class="top_img"></div>
          <div class="line"></div>
          <img class="avatar" src='${cardsData[i].avatar}' alt="">
          <p class="tweets">${cardsData[i].tweets} TWEETS</p>
          <p class="followers"  id=${cardsData[i].id + 'p'}>${cardsData[
      i
    ].followers.toLocaleString('en-EN')} FOLLOWERS</p>
          ${
            cardsData[i].active
              ? `<button class="button active" id=${cardsData[i].id}>FOLLOWING</button>}`
              : `<button class="button" id=${cardsData[i].id}>FOLLOW</button>`
          }          
        </div>
      </li>
          `;
    cardsContainer.insertAdjacentHTML('afterbegin', markup);
  }
  const buttonElAll = document.querySelectorAll('.button');
  buttonElAll.forEach(function (item) {
    item.addEventListener('click', clickItem);
  });
  firstCardPage = firstCardPage + 3;
  endCardPages = endCardPages + 3;
  if (cardsData.length >= endCardPages - 1) {
    loadMoreBtn.show();
  } else {
    loadMoreBtn.hide();
  }
}

const clickItem = function (e) {
  var clickedButton = e.target;
  var followingEl = document.getElementById(e.target.id + 'p');
  var cardOnClick = cardsData[e.target.id - 1];
  if (clickedButton.classList.contains('active')) {
    cardOnClick.active = false;
    e.target.innerHTML = 'FOLLOW';
    cardOnClick.followers = cardOnClick.followers - 1;
  } else {
    cardOnClick.active = true;
    e.target.innerHTML = 'FOLLOWING';
    cardOnClick.followers = cardOnClick.followers + 1;
  }
  clickedButton.classList.toggle('active');
  followingEl.textContent =
    cardOnClick.followers.toLocaleString('en-EN') + ' FOLLOWERS';
  localStorage.setItem('Data', JSON.stringify(cardsData));
};

window.onload = setData;

function setData() {
  if (storageData) {
    cardsData = JSON.parse(storageData);
    renderCards(cardsData);
  } else {
    fetchData();
  }
}
