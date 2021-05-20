(async function getProjects() {
  const query = JSON.stringify({
    query: `{
      user(login: "romeo-folie") {
        avatarUrl
        bio
        name
        repositories(last: 20) {
          totalCount
          nodes {
            name
            description
            updatedAt
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            languages(first: 1) {
              nodes {
                name
                color
              }
            }
          }
        }
      }
    }
    `,
  });

  try {
    const token = [
      "\x35\x31\x61\x33\x64\x39\x37\x66\x65\x37\x64\x32\x37\x34\x32\x38\x31\x38\x64\x61\x66\x31\x32\x30\x36\x65\x30\x64\x62\x31\x37\x36\x39\x37\x37\x39\x30\x62\x33\x33",
    ];

    const response = await fetch("https://api.github.com/graphql", {
      method: "post",
      body: query,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await response.json();

    if (userData) {
      const today = new Date();

      const projectHtml = userData.data.user.repositories.nodes
        .map((repo) => {
          return `
      <div class="repo">
      <div class="title-row">
        <a href="#" id="title">${repo.name}</a>
        <a href="#" class="star-btn">
          <svg
            class="octicon octicon-star mr-1"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
            ></path>
          </svg>
          Star
        </a>
      </div>

      <p id="description">
        ${repo.description || ""}
      </p>

      <div class="extra-info">
        <div class="lang">
          <span style="background-color: ${
            repo.languages.nodes.length ? repo.languages.nodes[0].color : "red"
          }"class="color"></span>
          <span class="name">${
            repo.languages.nodes.length
              ? repo.languages.nodes[0].name
              : "Multiple"
          }</span>
        </div>

        <a href="#" class="stargazers">
          <svg
            class="octicon octicon-star mr-1"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
            ></path>
          </svg>
          ${repo.stargazers.totalCount}
        </a>

        <a href="#" class="forks">
          <svg
            aria-label="fork"
            class="octicon octicon-repo-forked"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            role="img"
          >
            <path
              fill-rule="evenodd"
              d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
            ></path>
          </svg>
          ${repo.forks.totalCount}
        </a>

        <span id="updated_at">Updated ${moment(repo.updatedAt).from(
          moment(today)
        )}</span>
      </div>
    </div>
      `;
        })
        .join("");

      document
        .querySelector(".repositories")
        .insertAdjacentHTML("afterbegin", projectHtml);

      const avatar = document.querySelector("#avi");
      const largeAvatar = document.querySelector("#avi-xl");
      avatar.setAttribute("src", userData.data.user.avatarUrl);
      largeAvatar.setAttribute("src", userData.data.user.avatarUrl);
    }
  } catch (err) {
    console.error(err);
  }
})();
