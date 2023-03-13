import React, { useState } from "react";
import axios from "axios";
import "./searchRepos.css";
const RepoCard = ({ repo }) => {
  return (
    <div className="card">
      <img src={repo.owner.avatar_url} alt="Avatar" />
      <div className="repo-details">
        <h2>{repo.name}</h2>
        <p>{repo.description}</p>
        <div className="repo-stats">
          <p>Stars: {repo.stargazers_count}</p>
          <p>Language: {repo.language}</p>
        </div>
      </div>
    </div>
  );
};

const RepoList = ({ repos }) => {
  return (
    <div className="repo-list">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

const SearchRepos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${searchTerm}`
      );
      setRepos(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    if (repos && repos.length > 0) {
      let temp = repos;
      temp.sort((a, b) =>
        e.target.value === "created_at" || e.target.value === "updated_at"
          ? new Date(a[e.target.value]) - new Date(b[e.target.value])
          : e.target.value === "name"
          ? a[e.target.value].localeCompare(b[e.target.value])
          : a[e.target.value] - b[e.target.value]
      );
      setRepos([...temp]);
    }
  };

  return (
    <div className="search-repos">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search Repositories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select onChange={handleChange}>
          <option value="" disabled selected hidden>
            Sort in ascending order
          </option>
          <option value="stargazers_count">Stars</option>
          <option value="watchers">Watchers</option>
          {/* <option value="count">Count</option> */}
          <option value="score">Score</option>
          <option value="name">Name</option>
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
        </select>
      </div>
      <RepoList repos={repos} />
    </div>
  );
};

export default SearchRepos;
