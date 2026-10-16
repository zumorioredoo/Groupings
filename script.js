          const storyPanel = document.getElementById("storyPanel");
          const viewMoreButton = document.getElementById("viewMoreButton");
          const closeStoryButton = document.getElementById("closeStoryButton");
          const closeStoryLink = document.getElementById("closeStoryLink");

          function openStory() {
              storyPanel.classList.add("is-open");
              storyPanel.setAttribute("aria-hidden", "false");
              storyPanel.inert = false;
              viewMoreButton.setAttribute("aria-expanded", "true");
              closeStoryButton.focus();
          }

          function closeStory() {
              storyPanel.classList.remove("is-open");
              storyPanel.setAttribute("aria-hidden", "true");
              storyPanel.inert = true;
              viewMoreButton.setAttribute("aria-expanded", "false");
              viewMoreButton.focus();
          }

          viewMoreButton.addEventListener("click", openStory);
          closeStoryButton.addEventListener("click", closeStory);
          closeStoryLink.addEventListener("click", closeStory);

          document.addEventListener("keydown", (event) => {
              if (event.key === "Escape" && storyPanel.classList.contains("is-open")) {
                  closeStory();
              }
          });




