          const reviewForm = document.getElementById("reviewForm");
          const reviewList = document.getElementById("reviewList");
          const reviewStatus = document.getElementById("reviewFormStatus");
          let savedReviews = [];

          try {
              const storedReviews = JSON.parse(localStorage.getItem("mochara-reviews") || "[]");
              if (Array.isArray(storedReviews)) {
                  savedReviews = storedReviews.filter((review) =>
                      review && typeof review.name === "string" && typeof review.text === "string" &&
                      Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
                      typeof review.date === "string",
                  );
              }
          } catch {
              try {
                  localStorage.removeItem("mochara-reviews");
              } catch {
              }
          }

          function createReviewEntry(review) {
              const article = document.createElement("article");
              article.className = "review-entry";

              const heading = document.createElement("div");
              heading.className = "review-entry-heading";
              const authorBlock = document.createElement("div");
              const author = document.createElement("h3");
              author.textContent = review.name;
              const date = document.createElement("time");
              date.dateTime = review.date;
              date.textContent = new Date(`${review.date}T12:00:00`).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              });
              authorBlock.append(author, date);

              const rating = document.createElement("span");
              rating.className = "review-stars";
              rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);
              rating.textContent = `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`;
              heading.append(authorBlock, rating);

              const text = document.createElement("p");
              text.textContent = review.text;
              article.append(heading, text);
              return article;
          }

          for (const review of savedReviews.slice().reverse()) {
              reviewList.prepend(createReviewEntry(review));
          }

          reviewForm.addEventListener("submit", (event) => {
              event.preventDefault();
              const formData = new FormData(reviewForm);
              const review = {
                  name: formData.get("name").trim(),
                  rating: Number(formData.get("rating")),
                  text: formData.get("review").trim(),
                  date: new Date().toISOString().slice(0, 10),
              };

              if (!review.name || !review.text) return;

              reviewList.prepend(createReviewEntry(review));
              savedReviews.unshift(review);
              try {
                  localStorage.setItem("mochara-reviews", JSON.stringify(savedReviews));
              } catch {
              }
              reviewForm.reset();
              reviewStatus.textContent = "Thank you. Your review has been posted.";
          });
