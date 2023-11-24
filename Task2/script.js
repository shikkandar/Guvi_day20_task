let currentPage = 1;
let itemsPerPage = 5;

//getting items per page
const selectColor = document.getElementById('selectColor');

    selectColor.addEventListener('change', function() {
        const selectedValue = selectColor.value;
        itemsPerPage=selectedValue;

        console.log(itemsPerPage);
        apiData()
    });





async function apiData() {
    try {
        const res=await fetch("https://www.arbeitnow.com/api/job-board-api")
        const data=await res.json()

        employeeData(data)
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.log("api data:",err);
    }
}

function getRandomLightColor() {
    const letters = '89ABCDEF'; // Use lighter hex values
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

async function employeeData(data) { 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    main.innerHTML = ''; // Clear existing content

    data.data.slice(startIndex, endIndex).forEach(async (jobData, i) => {
        const companyName = jobData.company_name;
        const title = jobData.title;
        const description = jobData.description;
        const location = jobData.location;

        const con = document.createElement('div');
        con.setAttribute('class', 'm-5 con p-5 ');
        con.setAttribute("data-aos","zoom-in-up");

        // Apply a random light background color
        con.style.backgroundColor = getRandomLightColor();

        main.append(con);
        con.innerHTML = `<div>
                            <h2>Location:${location}</h2>
                            <h2>Job title:${title}</h2>
                            <h4>Company Name:${companyName}</h4>
                            <div>Job description:${description}</div>
                        </div>`;
    });

    addPagination(data.data.length);
}


function addPagination(totalItems) {
    const totalPages=Math.ceil(totalItems/itemsPerPage) 
    const paginationContainer = document.getElementById('pagination');

    // Clear existing pagination controls
    paginationContainer.innerHTML = '';

    //first page
    const firstPageBtn=document.createElement('button')
    firstPageBtn.innerText="F"

    firstPageBtn.addEventListener('click',()=>{
        currentPage=1;
        apiData()
    })

    paginationContainer.appendChild(firstPageBtn)
    //previous page btn
    const previousBtn=document.createElement('button')
    previousBtn.innerText="<<"
    
    previousBtn.addEventListener('click',()=>{
        if (currentPage >1) {
            currentPage--;
            apiData()
        }
    })
    paginationContainer.appendChild(previousBtn)

    //All pages btn
    for (let i = 1; i <=totalPages; i++) {
        const btn=document.createElement('button')
        btn.innerText=i;

        btn.addEventListener('click',()=>{
            currentPage=i;
            apiData()
        })
        paginationContainer.appendChild(btn)
    }

    //create next button

    const nextBtn=document.createElement('button')
    nextBtn.innerText='>>'

    nextBtn.addEventListener('click',()=>{
        if (currentPage < totalPages) {
            currentPage++;
            apiData()
        }
    })

    paginationContainer.appendChild(nextBtn)

      //last page
      const lastPageBtn=document.createElement('button')
      lastPageBtn.innerText="L"
  
      lastPageBtn.addEventListener('click',()=>{
          currentPage=totalPages;
          apiData()
      })
    paginationContainer.appendChild(lastPageBtn)
}

apiData()



//page scroll top btn

const upBtn=document.getElementById('up')

function scrollTop(upBtn) {
    upBtn.addEventListener('click',()=>{
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
}

scrollTop(upBtn)
// page scroll bottom btn

const downBtn = document.getElementById('down');

function scrollDown(downBtn) {
  downBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
}

scrollDown(downBtn);
