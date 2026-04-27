/* =======================
W3b Title
======================= */
document.addEventListener("DOMContentLoaded", function() {
  
    const baseTitle = "jenny kim";
    const awayTitle = "( ˶°ㅁ°) YAH!!";
    document.title = baseTitle;
    document.addEventListener("visibilitychange", () => 
      document.title = document.hidden ? awayTitle : baseTitle
    );
});

/* =======================
Cursor
======================= */
const follower = document.getElementById('follower');

document.addEventListener('mousemove', (event) => {
  const x = event.clientX;
  const y = event.clientY;

  // Position the follower such that its center is at the mouse cursor
  const offsetX = -follower.offsetWidth / 2;
  const offsetY = -follower.offsetHeight / 2;

  follower.style.left = (x + offsetX) + 'px';
  follower.style.top = (y + offsetY) + 'px';
});

/* =======================
Bio-Hover
======================= */
// Get the elements
const hoverJenny = document.querySelector('.hover-jenny');
const hiddenTexts = document.querySelectorAll('.hidden-text');
// Function to show the hidden text
function showHiddenText() {
  hiddenTexts.forEach(text => {
    text.style.opacity = '1'; // Make the hidden text visible
    text.style.transition = 'opacity 0.5s ease'; // Add smooth transition
  });
}
// Function to hide the hidden text
function hideHiddenText() {
  hiddenTexts.forEach(text => {
    text.style.opacity = '0'; // Hide the text
  });
}
// Add event listeners to handle hover
hoverJenny.addEventListener('mouseenter', showHiddenText); // Show text when hovering over Jenny kim
hoverJenny.addEventListener('mouseleave', hideHiddenText); // Hide text when mouse leaves

/* =======================
Project 
======================= */
function toggleProject(projectNumber) {
    const allProjects = document.querySelectorAll('.project');
    const allLinks = document.querySelectorAll('.link.work');

    // Close all other projects
    allProjects.forEach(project => {
        if (project.id !== 'project' + projectNumber) {
            project.classList.remove('open');
        }
    });

    // Remove active-link from all other links
    allLinks.forEach(link => {
        if (link !== document.querySelector(`.link.work[onclick="toggleProject(${projectNumber})"]`)) {
            link.classList.remove('active-link');
        }
    });

    const project = document.getElementById('project' + projectNumber);
    const activeLink = document.querySelector(`.link.work[onclick="toggleProject(${projectNumber})"]`);

    const isOpen = project.classList.toggle('open');

    if (isOpen) {
        activeLink.classList.add('active-link');
    } else {
        activeLink.classList.remove('active-link');
    }
}

// Close any project when clicking outside
document.body.addEventListener('click', function(event) {
    const allProjects = document.querySelectorAll('.project');
    allProjects.forEach(project => {
        // Close project if it's open and clicked outside of it
        if (project.classList.contains('open') &&
            !project.contains(event.target) &&
            !event.target.closest('.link')) {
            project.classList.remove('open');
            const activeLink = document.querySelector(`.link.work[onclick="toggleProject(${project.id.replace('project', '')})"]`);
            if (activeLink) {
                activeLink.classList.remove('active-link');
            }
        }
    });
});

// Prevent closing the project when clicking inside the project
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop click event from propagating to the body
    });
});

/* =======================
Copy
======================= */
function copyText(element, event) {
    const text = element.innerText;

    navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied:", text);
        showCopyMessage(event.pageX, event.pageY);
    }).catch(err => {
        console.error("Failed to copy text", err);
    });
}

function showCopyMessage(x, y) {
    let message = document.createElement("div");
    message.innerText = "copied!";
    message.classList.add("copy-message");
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = "0";
        setTimeout(() => message.remove(), 500);
    }, 1000);
}

/* =======================
AI video
======================= */
const video = document.getElementById("video");
  const play = document.getElementById("play");
  const mute = document.getElementById("mute");
  const seek = document.getElementById("seek");
  const time = document.getElementById("time");
  const player = document.getElementById("player");

  const fmt = (s) => {
    s = Math.max(0, s || 0);
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

//keep the button label in sync with the actual muted state
  function syncMuteUI() {
    mute.textContent = video.muted ? "Unmute" : "Mute";
  }

  // make sure UI matches state immediately (works before play)
  syncMuteUI();

  play.addEventListener("click", async () => {
    if (video.paused) {
      try { await video.play(); } catch (e) {}
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => (play.textContent = "Pause"));
  video.addEventListener("pause", () => (play.textContent = "Play"));

  mute.addEventListener("click", () => {
    video.muted = !video.muted;
    syncMuteUI();
    localStorage.setItem("videoMuted", String(video.muted)); // optional
  });

// if muted changes for any reason, keep button correct
video.addEventListener("volumechange", syncMuteUI);

// get duration earlier + show correct total time even before play
video.addEventListener("loadedmetadata", () => {
    time.textContent = `${fmt(0)} / ${fmt(video.duration)}`;
  });

  // Update seek bar as video plays
video.addEventListener("timeupdate", () => {
  if (!isNaN(video.duration)) {
  const pct = (video.currentTime / video.duration) * 100;
  seek.value = pct;
  time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  }
});

// Seek when user drags
seek.addEventListener("input", () => {
  if (!isNaN(video.duration)) {
    video.currentTime = (Number(seek.value) / 100) * video.duration;
  }
});

//RESETS and PAUSES the video when clicking outside of the project container
document.body.addEventListener("click", function (event) {
  const allProjects = document.querySelectorAll(".project");
  allProjects.forEach(project => {
    const video = project.querySelector("video");
    const seek = project.querySelector("#seek");
    const time = project.querySelector("#time");
    if (!project.contains(event.target) && video) {
      // ✅ FULL RESET
      video.currentTime = 0;
      video.load();
      play.textContent = "Play";
      if (seek) seek.value = 0;
      if (time) {
        const total = isNaN(video.duration) ? 0 : video.duration;
        time.textContent = `${fmt(0)} / ${fmt(total)}`;
      }
    }
  });
});