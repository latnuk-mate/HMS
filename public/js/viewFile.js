let currentPage = 0;
let prevProgress = 0;
let pages = document.querySelectorAll(".page");
const progressBar = document.querySelector(".progress-bar");

function showPage(index) {
  pages[currentPage].style.display = "none";
  currentPage = index;
  pages[index].style.display = "block";
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
    if (currentPage == 1) {
      prevProgress += 50;
    } else {
      prevProgress += 25;
    }

    progressBar.style.width = `${prevProgress}%`;
  }
}

function prevPage() {
  if (currentPage > 0) {
    showPage(currentPage - 1);
    if (currentPage == 0) {
      prevProgress -= 50;
    } else {
      prevProgress -= 25;
    }
    progressBar.style.width = `${prevProgress}%`;
  }
}


// health card area...

const generateBtn = document.getElementById('generateBtn');
const text = document.getElementById('btn--text');
const downloadProgress = document.querySelector('.downloadBar');
const Progress = document.querySelector('.bar');
const link = document.querySelector('.link');
 let currentWidth = 0;
 let interval;

function downloadingFile(){
    Progress.style.visibility = 'visible';
    text.innerHTML = "Generating file...";
    currentWidth += 2; 
    downloadProgress.style.width = `${currentWidth}%`;

    if(currentWidth >= 100){
        clearInterval(interval);
        Progress.style.visibility = 'hidden';
        generateBtn.style.display = 'none';
        link.style.display = 'block';
    }
}

generateBtn.addEventListener('click', ()=>{
    interval = setInterval(()=>{
        downloadingFile()
    }, 100);
});
