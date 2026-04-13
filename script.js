const bookForm = document.getElementById("bookForm");
const bookInput = document.getElementById("bookInput");
const loadingMessage = document.getElementById("loadingMessage");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");

async function searchBooks(bookName) {
  loadingMessage.classList.remove("hidden");
  resultsTable.classList.add("hidden");
  resultsBody.innerHTML = "";

  const formattedBookName = bookName.trim().split(" ").join("+");
  const url = `https://openlibrary.org/search.json?title=${bookName}
`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    loadingMessage.classList.add("hidden");

    if (data.docs.length === 0) {
      resultsBody.innerHTML = `
        <tr>
          <td colspan="2">No results found.</td>
        </tr>
      `;
      resultsTable.classList.remove("hidden");
      return;
    }

    data.docs.slice(0, 10).forEach((book) => {
      const title = book.title ? book.title : "N/A";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
      `;
      resultsBody.appendChild(row);
    });

    resultsTable.classList.remove("hidden");
  } catch (error) {
    loadingMessage.classList.add("hidden");
    resultsBody.innerHTML = `
      <tr>
        <td colspan="2">Error loading books.</td>
      </tr>
    `;
    resultsTable.classList.remove("hidden");
    console.error("Error fetching books:", error);
  }
}

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookName = bookInput.value;

  if (bookName.trim() !== "") {
    searchBooks(bookName);
  }
});