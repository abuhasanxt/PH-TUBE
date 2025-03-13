const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("videosContainer").classList.add("hidden");
};
const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("videosContainer").classList.remove("hidden");
};

function removeActiveClass() {
  const activeButons = document.getElementsByClassName("active");
  for (let btn of activeButons) {
    btn.classList.remove("active");
  }
  console.log(activeButons);
}

function loadCategory() {
  // fetch the data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    // convert peomisw to json
    .then((res) => res.json())
    //  sent data to disply
    .then((data) => displyCategorys(data.categories));
}

function loadVideos(searchText = "") {
  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((Response) => Response.json())
    .then((data) => {
      document.getElementById("btn-all").classList.add("active");
      displyVideos(data.videos);
    });
}

const loadCategoryVideos = (id) => {
  showLoader();
  const url = `
https://openapi.programming-hero.com/api/phero-tube/category/${id}
`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add("active");

      displyVideos(data.category);
    });
};

const loadVideoDetails = (videoId) => {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displyVideosDetails(data.video));
};

const displyVideosDetails = (video) => {
  console.log(video);
  document.getElementById("videoDetails").showModal();
  const detailsContainer = document.getElementById("detailsContainer");
  detailsContainer.innerHTML = `
   <div class="card bg-base-100 image-full  shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="hhhhh" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
   
    <div class="card-actions justify-end">
    
    <h2>${video.description}</h2>
    </div>
    </div>
</div>


  `;
};
// {category_id: '1001',
//  category: 'Music'}

function displyCategorys(categories) {
  const categoryContainer = document.getElementById("categoryContainer");
  // loop  oparation
  for (let cat of categories) {
    // console.log(cat);

    // create Eliment

    const categorieDiv = document.createElement("div");
    categorieDiv.innerHTML = `
   <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
   `;
    //  append
    categoryContainer.append(categorieDiv);
  }
}

const displyVideos = (videos) => {
  const videosContainer = document.getElementById("videosContainer");
  videosContainer.innerHTML = "";
  if (videos.length == 0) {
    videosContainer.innerHTML = `
     <div class="py-20 col-span-full text-center flex flex-col justify-center items-center">
        <img class="w-[120px]" src="./asects/Icon.png" alt="">
        <h2 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h2>
      </div>
    `;
    hideLoader();
    return;
  }
  // loop operation
  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
<div class="card bg-base-100">
        <figure class="relative">
          <img class="w-full md:h-[150px] object-cover" src="${
            video.thumbnail
          }" alt="Shoes" />
          <span
            class="absolute bottom-2 right-2 text-white text-sm bg-black rounded px-2"
            >3hrs 56 min ago</span
          >
        </figure>

        <div class="flex gap-3 px-0 py-5">
          <div class="profile">
            <div class="avatar">
              <div
                class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2"
              >
                <img
                  src="${video.authors[0].profile_picture}"
                />
              </div>
            </div>
          </div>

          <div class="intro">
            <h2 class="text-sm font-semibold">Midnight Serenade</h2>
            <p class="text-sm text-gray-400 flex gap-1">
            ${video.authors[0].profile_name}
            ${
              video.authors[0].verified == true
                ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=96&id=102561&format=png" alt="">`
                : ` `
            }
            
            </p>
            <p class="text-sm text-gray-400">${video.others.views}</p>
          </div>
        </div>
        <button onclick=loadVideoDetails('${
          video.video_id
        }') class="btn btn-block">Show Details</button>
      </div>
    `;
    videosContainer.append(videoCard);
  });
  hideLoader();
};

document.getElementById("searchInput").addEventListener("keyup", (e) => {
  const input = e.target.value;
  loadVideos(input);
});
loadCategory();
