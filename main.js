// DOM elements
const container = document.querySelector(".container")
const filterBox = document.querySelector(".filter")
const clearButton = filterBox.querySelector("p")


// Variables
let jobs = []
let filters = []


filterBox.remove()
clearButton.addEventListener("click", () => {
  filters = []
  filterTags()
})

// Fetching data
fetch("./data.json").then(res => res.json())
.then(data => {
  data.forEach(job => {
    container.append(createJobElement(job))
    let filterTags = [job.role, job.level, ...job.languages, ...job.tools]
    job.filterTags = filterTags
    jobs.push(job)
  });


})

// FUNCTIONS -----------

function createJobElement(jobObj) {
  const jobDiv = document.createElement("div")
  jobDiv.classList.add("job")
  if (jobObj.new) jobDiv.classList.add("new")
  if (jobObj.featured) jobDiv.classList.add("featured")
  
  // info 
  const infoDiv = document.createElement("div")
  infoDiv.className = "info"
  const img = document.createElement("img")
  img.src = jobObj.logo
  infoDiv.append(img)
  // outer div
  const outerDiv = document.createElement("div")
  const p = document.createElement("p")
  p.append(jobObj.company)
  const outerSpan = document.createElement("span")
  const newSpan = document.createElement("span")
  const featuredSpan = document.createElement("span")
  newSpan.innerHTML = "NEW!"
  featuredSpan.innerHTML = "FEATURED"
  outerSpan.append(newSpan)
  outerSpan.append(featuredSpan)
  p.append(outerSpan)
  outerDiv.append(p)
  // h3
  const h3 = document.createElement("h3")
  h3.innerHTML = jobObj.position
  outerDiv.append(h3)
  // inner div
  const innerDiv = document.createElement("div")
  const firstSpan = document.createElement("span")
  const secondSpan = document.createElement("span")
  const thirdSpan = document.createElement("span")
  firstSpan.innerHTML = jobObj.postedAt
  secondSpan.innerHTML = jobObj.contract
  thirdSpan.innerHTML = jobObj.location
  innerDiv.append(firstSpan)
  innerDiv.append(secondSpan)
  innerDiv.append(thirdSpan)
  outerDiv.append(innerDiv)
  infoDiv.append(outerDiv)
  jobDiv.append(infoDiv)
  // tags
  const tagsDiv = document.createElement("div")
  tagsDiv.className = "tags"
  const roleSpan = document.createElement("span")
  const levelSpan = document.createElement("span")
  roleSpan.innerHTML = jobObj.role
  levelSpan.innerHTML = jobObj.level
  tagsDiv.append(roleSpan)
  tagsDiv.append(levelSpan)
  const langs = jobObj.languages
  for (let i = 0; i < langs.length; i++) {
    const langSpan = document.createElement("span")
    langSpan.innerHTML = langs[i]
    tagsDiv.append(langSpan)
  }
  if (jobObj.tools.length > 0) {
    const tools = jobObj.tools
    for (let i = 0; i < tools.length; i++) {
      const toolSpan = document.createElement("span")
      toolSpan.innerHTML = tools[i]
      tagsDiv.append(toolSpan)
    }
  }


    // tags filtering
    tagsDiv.querySelectorAll("span").forEach(tag => {
      tag.addEventListener("click", () => {
        if (!filters.includes(tag.textContent)) {
  
          filters.push(tag.textContent)
          filterTags()
  
        }
      })
    })
  jobDiv.append(tagsDiv)

  return jobDiv
}

function createFilterSpan(filterTag) {
  const parentSpan = document.createElement("span")
  parentSpan.append(filterTag)
  const removeSpan = document.createElement("span")
  const img = document.createElement("img")
  img.src = "./images/icon-remove.svg"
  removeSpan.append(img)
  parentSpan.append(removeSpan)
  removeSpan.addEventListener("click", () => {

    filters.splice(filters.indexOf(filterTag), 1)

    filterTags()
  })
  return parentSpan
}

function filterTags() {

  if (filters.length > 0) {

    document.body.append(filterBox)
    
    // removing old spans
    filterBox.querySelectorAll("span").forEach(span => span.remove())

    // appending filter to filters box
    for (let tagName of filters) {
      const tag = createFilterSpan(tagName)
      filterBox.append(tag)
    }

    // filtering jobs
    filterJobs()



  } else {
    filterBox.querySelectorAll("span").forEach(span => span.remove())
    filterBox.remove()
    container.innerHTML = ""
    for (let job of jobs) {
      container.append(createJobElement(job))
    }
  }

}

function filterJobs() {

  let filteredJobs = []
  console.log("new call")
  jobs.forEach(job => {
    const jobTags = job.filterTags
    let tagMatchesCount = 0
    for (let tag of filters) {

      if (jobTags.includes(tag)) {
        tagMatchesCount++
      }

    }
    console.log("=".repeat(20))
    console.log(tagMatchesCount)

    if (tagMatchesCount === filters.length) {
      filteredJobs.push(job)
    }

  })
  container.innerHTML = ""
  for (let job of filteredJobs) {
    container.append(createJobElement(job))
  }
}

function checkIfFiltersDoesNotHave(tag) {
  for (let i = 0; i < filters.length; i++) {
    if (filters[i][0] === tag) return false
  }
  return true
}