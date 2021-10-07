let posts = [];
let filteredPosts = [];
let maxDisplayLimit = 6;
const postContainer = document.querySelector('.post-container');
const search = document.querySelector('[type="search"]');

const returnPostDate = (date) =>
    `${
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;

const searchFilter = (post) =>
    [post.title, post.summary, post.user.name[0].firstName, post.user.name[1].lastName]
        .map((text) => text)
        .join('')
        .toLowerCase()
        .indexOf(search.value.toLowerCase()) !== -1;

function generatePost(post) {
    const article = document.createElement('article');
    article.classList.add('post');
    article.innerHTML = `
  <div class="post__meta">
    <div class="post__tag--container">
      ${post.meta.tags.map((tag) => `<span class="post__tag">${tag}</span>`).join(' ')}
    </div>
    <p class="post__date">${returnPostDate(new Date(post.meta.date))}</p>
  </div>
  <h3 class="post__header">
    <a href="${post.meta.url}">${post.title}</a>
  </h3>
  <div class="post__author">
    <img class="post__author--avatar" width="55" src="${post.user.avatar}" alt="${
        post.user.name[0].firstName
    } ${post.user.name[1].lastName}">
    <div>
      <p class="post__author--name">${post.user.name[0].firstName} ${post.user.name[1].lastName}</p>
      <p class="post__author--role"><small>${post.user.jobTitle}</small></p>
    </div>
  </div>
  <p class="post__body">
    ${post.summary}
  </p>
  <a href="${post.meta.url}" class="btn">Read Post</a>`;
    return article;
}

function loadPosts() {
    const frag = document.createDocumentFragment();
    filteredPosts.slice(0, maxDisplayLimit).map((post) => frag.appendChild(generatePost(post)));
    postContainer.innerHTML = '';
    postContainer.appendChild(frag);
}

function filterPosts() {
    filteredPosts = posts.filter(searchFilter);
    loadPosts();
}

function viewMorePosts() {
    maxDisplayLimit += maxDisplayLimit;
    filterPosts();
}

search.addEventListener('keyup', filterPosts);
document.querySelector('.btn--view').addEventListener('click', viewMorePosts);

async function fetchPosts() {
    await fetch('./posts.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            posts = data.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
            filterPosts();
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
fetchPosts();
