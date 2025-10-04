const jsonPath = 'quizPatenteB2023.json'

const qs = sel => document.querySelector(sel)
const $category = qs('#category')
const $subcategory = qs('#subcategory')
const $start = qs('#start')
const $restart = qs('#restart')
const $quiz = qs('#quiz')
const $card = qs('#card')
const $qimg = qs('#qimg')
const $qtext = qs('#qtext')
const $true = qs('#trueBtn')
const $false = qs('#falseBtn')
const $current = qs('#current')
const $total = qs('#total')
const $result = qs('#result')
const $score = qs('#score')
const $scoreTotal = qs('#scoreTotal')
const $back = qs('#back')

let data = null
let quizList = []
let idx = 0
let score = 0
let accepting = false

function preserveOrderKeys(obj){
  return Object.keys(obj)
}

function populateCategories(){
  const cats = preserveOrderKeys(data)
  $category.innerHTML = ''
  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = 'seleziona categoria'
  $category.appendChild(placeholder)
  for(const k of cats){
    const o = document.createElement('option')
    o.value = k
    o.textContent = k.replace(/-/g,' ')
    $category.appendChild(o)
  }
}

function populateSubcategories(cat){
  $subcategory.innerHTML = ''
  if(!cat || !data[cat]){ $subcategory.disabled = true; $subcategory.append(new Option('seleziona categoria', '')); return }
  const subs = preserveOrderKeys(data[cat])
  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = 'tutte (random 30)'
  $subcategory.appendChild(placeholder)
  for(const s of subs){
    const o = document.createElement('option')
    o.value = s
    o.textContent = s.replace(/-/g,' ')
    $subcategory.appendChild(o)
  }
  $subcategory.disabled = false
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]
  }
}

function buildQuiz(cat, sub){
  quizList = []
  if(!cat) return
  if(sub){
    const items = data[cat][sub] || []
    quizList = items.map(x=>({q:x.q,a:!!x.a,img:x.img||null}))
    shuffle(quizList)
  } else {
    const subs = preserveOrderKeys(data[cat])
    for(const s of subs){
      const items = data[cat][s] || []
      for(const it of items) quizList.push({q:it.q,a:!!it.a,img:it.img||null})
    }
    shuffle(quizList)
    quizList = quizList.slice(0,30)
  }
  if(sub) {
  }
}

function showQuestion(i){
  const item = quizList[i]
  $current.textContent = i+1
  $total.textContent = quizList.length
  if(item.img){
    const src = item.img.startsWith('/') ? item.img.substring(1) : item.img
    $qimg.src = src
    $qimg.alt = ''
    $qimg.style.display = ''
    $qimg.classList.remove('hidden')
  } else {
    $qimg.removeAttribute('src')
    $qimg.alt = ''
    $qimg.classList.add('hidden')
    $qimg.style.display = 'none'
  }
  $qtext.textContent = item.q
  accepting = true
  $true.classList.remove('disabled','correct','incorrect')
  $false.classList.remove('disabled','correct','incorrect')
}

function endQuiz(){
  $quiz.classList.add('hidden')
  $result.classList.remove('hidden')
  $score.textContent = score
  $scoreTotal.textContent = quizList.length
  $start.disabled = false
  $restart.disabled = true
  accepting = false
}

function startQuiz(){
  const cat = $category.value
  const sub = $subcategory.value || ''
  if(!cat){ alert('seleziona una categoria'); return }
  buildQuiz(cat, sub)
  if(quizList.length===0){ alert('nessuna domanda disponibile per la selezione'); return }
  idx = 0; score = 0
  $score.textContent = '0'
  $scoreTotal.textContent = quizList.length
  $start.disabled = true
  $restart.disabled = false
  $quiz.classList.remove('hidden')
  $result.classList.add('hidden')
  showQuestion(idx)
}

function provideFeedback(buttonEl, selectedVal, isCorrect){
  if(selectedVal) buttonEl.classList.add('correct')
  else buttonEl.classList.add('incorrect')
  $true.classList.add('disabled')
  $false.classList.add('disabled')
  accepting = false
  const fb = qs('#feedback')
  if(fb){
    fb.classList.remove('hidden','correct','incorrect')
    if(isCorrect){ fb.textContent = 'Corretto'; fb.classList.add('correct') }
    else { fb.textContent = 'Errato'; fb.classList.add('incorrect') }
  }
}

function handleAnswer(val){
  if(!accepting) return
  const correct = !!quizList[idx].a
  const chosenBtn = val ? $true : $false
  if(val===correct) score++
  provideFeedback(chosenBtn, val, val===correct)
  setTimeout(()=>{
    const fb = qs('#feedback')
    if(fb){ fb.classList.add('hidden'); fb.textContent = '' }
    idx++
    if(idx>=quizList.length) endQuiz()
    else showQuestion(idx)
  }, 700)
}

function resetAll(){
  $start.disabled = false
  $restart.disabled = true
  $quiz.classList.add('hidden')
  $result.classList.add('hidden')
  idx = 0; score = 0; quizList = []
  accepting = false
}

$category.onchange = function(){ populateSubcategories(this.value) }
$start.onclick = startQuiz
$restart.onclick = resetAll
$true.onclick = function(){ handleAnswer(true) }
$false.onclick = function(){ handleAnswer(false) }
$back.onclick = function(){ resetAll(); $category.value=''; populateSubcategories(''); }

document.onkeydown = function(e){
  if(e.key==='t' || e.key==='T') handleAnswer(true)
  if(e.key==='f' || e.key==='F') handleAnswer(false)
  if(e.code==='Space'){
    if($result && !$result.classList.contains('hidden')){ resetAll(); $category.value=''; populateSubcategories(''); }
  }
}

async function init(){
  try{
    const res = await fetch(jsonPath)
    if(!res.ok) throw new Error('impossibile caricare JSON')
    data = await res.json()
    populateCategories()
    populateSubcategories('')
  }catch(err){
    console.error(err)
    $category.innerHTML = '<option>errore caricamento</option>'
  }
}

init()