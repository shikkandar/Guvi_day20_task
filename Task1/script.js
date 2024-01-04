/*********************************variable declaration for pagination*************************************/
let currentPage;
let surahNumber;
const translationKey = {
    Tamil: 'tamil_baqavi',
    English:'english_saheeh',
    Urdu:'urdu_junagarhi',
    Hindi: 'hindi_omari',
    Malayalam: 'malayalam_kunhi',
    Telugu: 'telugu_muhammad',
    Kannada:'english_rwwad',
    Punjabi: 'punjabi_arif',
    Gujarati:'gujarati_omari',
    Assamese: 'assamese_rafeeq',
    Nepali: 'assamese_rafeeq',
};
let lan = 'Tamil';
// Save data into local storage
function saveDataToLocalStorage() {
    localStorage.setItem('currentPage', currentPage.toString());
    localStorage.setItem('surahNumber', surahNumber.toString());
    localStorage.setItem('language', lan);
}

// Retrieve data from local storage or use default values
function retrieveDataFromLocalStorage() {
    currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    surahNumber = parseInt(localStorage.getItem('surahNumber'), 10) || 1;
    lan = localStorage.getItem('language') || 'Tamil';

}

// Initialize current page and surahNumber
retrieveDataFromLocalStorage();

/*********************************variable declaration for pagination*************************************/
let itemPerPage = 50;





/*************************************language selection start*****************************************/



const language = document.getElementById('language-list');
const ul = document.createElement('ul');
language.appendChild(ul);

Object.keys(translationKey).forEach(key => {
    const li = document.createElement('li');
    li.innerText = key;
    ul.appendChild(li);

    li.addEventListener('click', function() {
        lan = li.innerText;

        // Save the updated language to localStorage
        saveDataToLocalStorage();

        quranAudio(surahNumber);
        apiData();
    });
});



function lanBtn() {
    language.style.display=(language.style.display==='block') ?'none':'block';
}

/*************************************language selection eng*****************************************/






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
                            <source src="audio/${lan}/${surahNumber}.mp3" type="audio/mp3">
                         </audio>`
                         //from local
    audioDivMain.appendChild(audioDiv)
  
    apiData()
    retrieveDataFromLocalStorage()
}
quranAudio(surahNumber)
/*************************************Quran audio data end here *****************************************/














/*************************************Quran Text Data Start here*****************************************/
//apiData funtion for getting data
async function apiData() {
    try {
        // Example for surah translation
        const surahRes = await fetch(`https://quranenc.com/api/v1/translation/sura/${translationKey[lan]}/${surahNumber}`);
        const surahData = await surahRes.json();
       console.log(surahData);
        const kannadaSurah=await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/kan-abdussalamputhi.min.json');
        const kannadaSurahData= await kannadaSurah.json()
       
        const nepaliSurah=await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/nep-ahlalhadithcent-la.json');
        const nepaliSurahData= await nepaliSurah.json()


        //send data via funtion parameter
        quranDta(surahData,kannadaSurahData,nepaliSurahData)
    } catch (err) {
        console.error(err);
    }
    retrieveDataFromLocalStorage()
}

//api funtion for manipulating data
//getting data from funtion argument
async function quranDta(surahData,kannadaSurahData,nepaliSurahData) {
    const sura=surahData.result;
   

    // Update the global array with full data
    fullDataArr = sura.map(el => {
        const arabicText = el.arabic_text;
        let translateText = el.translation.replace(/\d/g, ''); // Remove numeric characters
        const dotIndex = translateText.indexOf('.');
    
        // Remove the first occurrence of ()
        const firstParenthesesIndex = translateText.indexOf('(');
        if (firstParenthesesIndex !== -1) {
            const closingParenthesesIndex = translateText.indexOf(')', firstParenthesesIndex);
            if (closingParenthesesIndex !== -1) {
                translateText = translateText.slice(0, firstParenthesesIndex) + translateText.slice(closingParenthesesIndex + 1);
            }
        }
    
        // Remove all square brackets []
        translateText = translateText.replace(/\[.*?\]/g, '');
    
        return {
            arabicText,
            translateText: dotIndex !== -1 ? translateText.slice(0, dotIndex) + translateText.slice(dotIndex + 1) : translateText,
            aya: el.aya
        };
    });
    
  
    //Save data into local
    localStorage.setItem('fullDataArr',JSON.stringify(fullDataArr))

  // Display surah translation in the surah div



  //text controller

  let arabicFont=32;
  let tamilFont=18;

  document.getElementById('plus').addEventListener('click',()=>{
    if (arabicFont <96 && tamilFont<96) {
        arabicFont +=2
        tamilFont +=2
        console.log(arabicFont,tamilFont);
        dataPrinting()
    }else{
        arabicFont=32;
        tamilFont=18;
    }
  })
  document.getElementById('minize').addEventListener('click',()=>{
    if (arabicFont >8 && tamilFont>0) {
        arabicFont -=4
        tamilFont -=2
         console.log(arabicFont,tamilFont);
        dataPrinting()
       }else{
        arabicFont=32;
        tamilFont=18;
       }
  })
  //Reterive full data arr from local storage
  const storedData=JSON.parse(localStorage.getItem('fullDataArr'))

  //slice data
  const startIndex=(currentPage-1)*itemPerPage;
  const endIndex=startIndex+itemPerPage;

  const slicedData=storedData.slice(startIndex,endIndex)
  const suraContainer= document.getElementById('sura')


  function dataPrinting() {
    suraContainer.innerHTML = '';
    slicedData.forEach(({ arabicText, translateText, aya }) => {
        const div = document.createElement('div');
        div.className = 'kannada'; // Use class instead of ID
        div.innerHTML = `<h2 class="text-end m-4" style="font-size: ${arabicFont}px;">${arabicText }<h2/>
                       <h6 style="font-size: ${tamilFont}px;">${aya}.${translateText}<h6/>`;

        suraContainer.appendChild(div);
        kannadaText({ arabicText, translateText, aya }, div); // Pass the div element as an argument
        nepaliText({ arabicText, translateText, aya }, div); // Pass the div element as an argument
    });
}

function kannadaText({ arabicText, aya }, div) {
    kannadaSurahData.quran.forEach((data) => {
        if (data.chapter === surahNumber) {
            if (lan === "Kannada") {
                console.log(data);
                div.innerHTML = `<h2 class="text-end m-4" style="font-size: ${arabicFont}px;">${arabicText }<h2/>
                <h6 style="font-size: ${tamilFont}px;">${aya}.${data.text}<h6/>`;
            }else{

            }
        }
    });
}
function nepaliText({ arabicText, aya }, div) {
    nepaliSurahData.quran.forEach((data) => {
        if (data.chapter === surahNumber) {
            if (lan === "Nepali") {
                console.log(data);
                div.innerHTML = `<h2 class="text-end m-4" style="font-size: ${arabicFont}px;">${arabicText }<h2/>
                <h6 style="font-size: ${tamilFont}px;">${aya}.${data.text}<h6/>`;
            }else{

            }
        }
    });
}


 dataPrinting()
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
    


        allBtn.innerText=i;
        allBtn.addEventListener('click', () => {
            currentPage = i;
        
            // Save the updated currentPage value to localStorage
            saveDataToLocalStorage();
        
            // Fetch and display updated data
            apiData();
        
            // Scroll to top
            scrollToTop();
        });
        
        paginationContainer.appendChild(allBtn)
        allBtn.addEventListener('click', scrollToTop);
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
                                <source src="audio/${lan}/${surahNumber}.mp3" type="audio/mp3">
                            </audio>`
        input.value = '';
        apiData(); // Fetch and display updated data
        scrollTop()
    }else alert("Enter a valid surah")
});

retrieveDataFromLocalStorage();
// Example usage
apiData();

//Funtion for sidemenu and and changing surah head and content of surah
sideMenu(...quranSurahNames)
function sideMenu(...quranSurahNames) {
    const sideMenuContainer = document.getElementById("sub-1");
    apiData();

    quranSurahNames.forEach((data, i) => {
        const surahName = data;
        const li = document.createElement('li');
        li.setAttribute('class', "mt-2");
        li.innerText = surahName;
        sideMenuContainer.appendChild(li);

        li.addEventListener('click', () => {
            // Update currentPage and surahNumber
            currentPage = 1;
            surahNumber = i + 1;

            // Save updated data to local storage
            saveDataToLocalStorage();

            // Update audio and heading
            audioDiv.innerHTML = `<audio controls>
                                    <source src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3" type="audio/mp3">
                                </audio>
                                <audio controls>
                                    <source src="audio/${lan}/${surahNumber}.mp3" type="audio/mp3">
                                </audio>`;
            head.innerHTML = `<h3>${surahNumber}.${quranSurahNames[surahNumber - 1]}-${arabicSuraNames[surahNumber - 1]} <h3/>`;

            // Fetch and display updated data
            apiData();
            toggleBtn();
            scrollToTop();
        });
    });
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
/**********************************Toggle controller end here**************************************/










/**********************************Scroll control start here**************************************/
// Scroll to top 
const upBtn = document.getElementById('top');
const sub2 = document.getElementById('sub-2');
sub2.addEventListener('click',()=>{
    language.style.display='none'
})
function scrollTop() {
    sub2.scrollTo({ top: 0, behavior: 'smooth' });
}

upBtn.addEventListener('click', scrollTop);
function scrollToTop() {
    sub2.scrollTo({ top: 0 });
  }

//scroll down

const topBtn=document.getElementById('down')

function scrollDown() {
    const scrollHeight = sub2.scrollHeight;
    sub2.scrollTo({ top: scrollHeight, behavior: 'smooth' });
}
topBtn.addEventListener('click',scrollDown)

saveDataToLocalStorage();
