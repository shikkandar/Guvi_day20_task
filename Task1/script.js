/*********************************variable declaration for pagination*************************************/
let currentPage=1;
let itemPerPage=40;
let surahNumber = 1;
/********************************variable declaration for pagination***************************** *********/
/*************************************Quran audio data start here *****************************************/
const audioDivMain=document.getElementById('audio');
const audioDiv=document.createElement('div');

//Audio funtion

function quranAudio(surahNumber) {
                        //from cdn
    audioDiv.innerHTML=` <audio controls>
                            <source src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3" type="audio/mp3">
                         </audio>
                         <audio controls>
                            <source src="Tamilquran/${surahNumber}.mp3" type="audio/mp3">
                         </audio>`
                         //from local
    audioDivMain.appendChild(audioDiv)
  
    apiData()
}
quranAudio(surahNumber)
/*************************************Quran audio data end here *****************************************/

/*************************************Quran Text Data Start here*****************************************/

//apiData funtion for getting data
async function apiData() {
    const translationKey = 'tamil_baqavi';
    try {
        // Example for surah translation
        const surahRes = await fetch(`https://quranenc.com/api/v1/translation/sura/${translationKey}/${surahNumber}`);
        const surahData = await surahRes.json();
       
        
        //send data via funtion parameter
        quranDta(surahData)
    } catch (err) {
        console.error(err);
    }
}

//api funtion for manipulating data
//getting data from funtion argument
async function quranDta(surahData) {
    const sura=surahData.result;
   

    // Update the global array with full data
    fullDataArr=sura.map(el => ({
        arabicText:el.arabic_text,
        tamilText:el.translation
    }))
   
    //Save data into local
    localStorage.setItem('fullDataArr',JSON.stringify(fullDataArr))

  // Display surah translation in the surah div
  const suraContainer= document.getElementById('sura')
  suraContainer.innerHTML='';


  //text controller
  let textSize=0;
  
  //Reterive full data arr from local storage
  const storedData=JSON.parse(localStorage.getItem('fullDataArr'))
  console.log(storedData);
  //slice data
  const startIndex=(currentPage-1)*itemPerPage;
  const endIndex=startIndex+itemPerPage;

  const slicedData=storedData.slice(startIndex,endIndex)

    slicedData.forEach(({arabicText,tamilText})=>{
        const div = document.createElement('div');

        div.innerHTML = `<h2 class="text-end m-4" style="font-size: ${32 + textSize}px;">${arabicText }<h2/>
                       <h6 style="font-size: ${18 + textSize}px;">${tamilText}<h6/>`;

        suraContainer.appendChild(div);
    })
    pagination(sura.length)
}
/*************************************Quran Text Data end here*****************************************/
/*************************************pagination start here********************************************/
function pagination(len) {
    const btsCount=Math.ceil(len/itemPerPage)
    const paginationContainer=document.getElementById('pagination');
 paginationContainer.innerHTML=''

    //all btns
    for (let i = 1; i <=btsCount; i++) {
        const allBtn=document.createElement('button');
        allBtn.setAttribute('class','btn btn-success m-2')
    
        allBtn.addEventListener('click', scrollTop);

        allBtn.innerText=i;
        allBtn.addEventListener('click',()=>{
            currentPage=i;
            apiData()
        })
        paginationContainer.appendChild(allBtn)
    }
}
/*************************************pagination end here********************************************/
/**************************Dta manipulating sideMenu Heading and audio*******************************/
//Surah names
const quranSurahNames = [
    'Al-Fatiha', 'Al-Baqara', 'Aal-E-Imran', 'An-Nisa', 'Al-Ma\'ida', 'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha', 'Al-Anbiya', 'Al-Hajj', 'Al-Muminun', 'An-Nur', 'Al-Furqan', 'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajda', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir', 'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf', 'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqia', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahina', 'As-Saff', 'Al-Jumu\'a', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haaqqa', 'Al-Maarij', 'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddathir', 'Al-Qiyama', 'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Burooj', 'At-Tariq', 'Al-Ala', 'Al-Ghashiya', 'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Lail', 'Adh-Dhuha', 'Ash-Sharh', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyina', 'Az-Zalzalah', 'Al-Adiyat', 'Al-Qaria', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraish', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafiroon', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
];
const arabicSuraNames = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الإنفطار', 'المطففين', 'الإنشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'
];
// Example usage

//funtion for changing surah head
const head=document.getElementById('head')
head.innerHTML = `<h3>${surahNumber}.${quranSurahNames[surahNumber - 1]}-${arabicSuraNames[surahNumber - 1]} <h3/>`;
document.getElementById('inpuBtn').addEventListener('click', () => {
    const input = document.getElementById('input');

    const head=document.getElementById('head')
    if (input.value >= 1 && input.value <= 114) {
        surahNumber = input.value;
        currentPage=1;
        head.innerHTML = `<h3>${surahNumber}.${quranSurahNames[surahNumber - 1]}-${arabicSuraNames[surahNumber - 1]} <h3/>`;
        audioDiv.innerHTML=` <audio controls>
                                <source src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3" type="audio/mp3">
                             </audio>
                            <audio controls>
                                <source src="Tamilquran/${surahNumber}.mp3" type="audio/mp3">
                            </audio>`
        input.value = '';
        apiData(); // Fetch and display updated data
    }else alert("Enter a valid surah")
});

// Example usage
apiData();

//Funtion for sidemenu and and changing surah head and content of surah
sideMenu(...quranSurahNames)
function sideMenu(...quranSurahNames) {
    const sideMenuContainer=document.getElementById("sub-1")
  apiData()
    quranSurahNames.forEach((data,i)=>{
      const surahName=data;
       const li=document.createElement('li')
        li.setAttribute('class',"mt-2")
        li.innerText=surahName;
       sideMenuContainer.appendChild(li)

       
       li.addEventListener('click',()=>{
        currentPage=1;
        surahNumber=i+1;
        audioDiv.innerHTML=` <audio controls>
                             <source src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3" type="audio/mp3">
                         </audio>
                         <audio controls>
                                    <source src="Tamilquran/${surahNumber}.mp3" type="audio/mp3">
                        </audio>`
       

        head.innerHTML = `<h3>${surahNumber}.${quranSurahNames[surahNumber - 1]}-${arabicSuraNames[surahNumber - 1]} <h3/>`;
        apiData()
       })
       
    })
   
}
/**************************Dta manipulating sideMenu Heading and audio*******************************/

/**********************************Toggle controller start here**************************************/

let btnOpen = document.getElementById("btnTop");
let closebtnEl =  document.getElementById("closeBtn");


const toggleBtn = ()=>{
    document.getElementById("sub-1").classList.toggle("ol-btn");
    document.getElementById("btnTop").classList.toggle("open-btn");
    document.getElementById("closeBtn").classList.toggle("close-btn");
}

btnOpen.addEventListener("click" , toggleBtn);
closebtnEl.addEventListener("click" , toggleBtn);


// Scroll to top 
const upBtn = document.getElementById('top');
const sub2 = document.getElementById('sub-2');

function scrollTop() {
    sub2.scrollTo({ top: 0, behavior: 'smooth' });
}

upBtn.addEventListener('click', scrollTop);


//scroll down

const topBtn=document.getElementById('down')

function scrollDown() {
    const scrollHeight = sub2.scrollHeight;
    sub2.scrollTo({ top: scrollHeight, behavior: 'smooth' });
}
topBtn.addEventListener('click',scrollDown)

/**********************************Toggle controller end here**************************************/