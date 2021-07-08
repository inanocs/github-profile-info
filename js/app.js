const form = document.getElementById("form");
const userProfile = document.getElementById("user_profile");
const searchInput = document.getElementById("search_text");

const fetchUserInfo = async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}`);
  let data = null;
  if (res.status != 404) {
    data = await res.json();
    data.repos = await fetchUserRepos(data.repos_url);
  } else {
    data = { message: "No se ha podido encontrar el usuario" };
  }
  return data;
};

const fetchUserRepos = async (path) => {
  const res = await fetch(path);
  const data = res.json();
  return data;
};
const renderUserInfo = (userData) => {
  if (userProfile.classList.contains("card--hide")) {
    userProfile.classList.remove("card--hide");
  }
  if (userData?.message == undefined) {
    const template = `
      <div class="card__info">
        <div class="card__img-container">
          <img
            src="${userData.avatar_url}"
            alt="Profile pic"
            class="card__img"
          />
        </div>
        <div class="card__personal-data">
          <h2>
            <a href="${userData.html_url}" class="card__link" target="__blank"
              >${userData.login}</a
            >
          </h2>
          <p class="card__text">${userData.bio}</p>
          <ul class="card__list">
            <li class="card__item badge badge--black"
              ><span class="card__text--bold">${userData.followers}</span> Seguidores</li
            >
            <li class="card__item badge badge--black"
              ><span class="card__text--bold">${userData.following}</span> Siguiendo</li
            >
            <li class="card__item badge badge--black"
              ><span class="card__text--bold">${userData.public_repos}</span>  Repositorios
            </li>
          </ul>
        </div>
        </div>
        <h2>Repositorios</h2>
          <ul id="repos" class="card__list card__list--no-justify"></ul>
      `;
    userProfile.innerHTML = template;
    renderUserRepos(userData.repos);
  } else {
    const template = `<p>${userData.message}</p>`;
    userProfile.innerHTML = template;
  }
};

const renderUserRepos = (repos) => {
  const list = document.getElementById("repos");
  const fragment = document.createDocumentFragment();
  repos.forEach((repo) => {
    const item = document.createElement("li");
    item.classList.add("card__item", "card__item--space");
    const link = document.createElement("a");
    link.classList.add("badge", "badge--black");
    link.href = repo.html_url;
    link.target = "__blank";
    link.textContent = repo.name;
    item.appendChild(link);
    fragment.appendChild(item);
  });

  list.appendChild(fragment);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = searchInput.value;
  let userInDom =
    document.getElementById("user_profile").lastElementChild != null
      ? document.getElementById("user_profile").firstElementChild
          .lastElementChild.firstElementChild.firstElementChild.textContent
      : "";
  if (username != "" && username != userInDom) {
    const userData = await fetchUserInfo(username);
    renderUserInfo(userData);
  }
});
searchInput.addEventListener("input", (e) => {
  const username = e.target.value;
  const placeholder = e.target.previousElementSibling;

  if (username == "") {
    placeholder.classList.remove("input-container__placeholder--active");
    e.target.classList.remove("form__control--active");
  } else {
    placeholder.classList.add("input-container__placeholder--active");
    e.target.classList.add("form__control--active");
  }
});
