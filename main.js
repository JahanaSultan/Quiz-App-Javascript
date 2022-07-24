const game_levels=[...document.querySelectorAll(".boxes ul li")]
const main_window=document.querySelector(".main")
const button = document.querySelector(".main button")
const input = document.querySelector('input')
const quiz_window = document.querySelector('.quiz-main')
const end_window=document.querySelector(".end")
const show_username=document.querySelector(".end .box h1:first-of-type")
const show_score=document.querySelector(".end .box h1:last-of-type")
const show_level=document.querySelector(".end .box h1:nth-of-type(2)")
const message=document.querySelector(".end .box p")
const loading = document.querySelector('.loading')
const quiz=document.querySelector(".quiz")
const question_text=document.querySelector(".quiz h4")
const answers=document.querySelector(".quiz ol")
const next=document.querySelector("#next")
const best=document.querySelector("#best")
let scores = [];


const display_loading = () => {
    loading.style.display = 'flex'
  }
  
const hide_loading = () => {
    loading.style.display = 'none'
  }

let level=''
let username=''
let score=0
let question_count=9
let correct_answer=''
let incorrect_answers=[]
let index=0
let questions=[]
let check_button=false


game_levels.map(e=>{
    e.addEventListener("click",()=>{
        game_levels.map((a) => a.classList.remove('active'))
        e.classList.add('active')
        level = e.innerText
    })
})

button.addEventListener("click",()=>{
    username=input.value
    if(level=="" || username==""){
        alert()
    }
    else{
        display_loading()
        main_window.style.display="none"
        quiz_window.style.display="flex"

        fetch(`https://opentdb.com/api.php?amount=50&difficulty=${level.toLocaleLowerCase()}`)
        .then(response=>response.json())
        .then(data=>{
            hide_loading()
            questions=data.results
            call_quiz(index,questions)
        })
    }
})



const call_quiz=(index,data)=>{
        correct_answer=""
        incorrect_answers=[]
        correct_answer=data[index].correct_answer
        incorrect_answers=data[index].incorrect_answers
        incorrect_answers.splice(Math.round(Math.random() * incorrect_answers.length), 0, correct_answer)
        question_text.innerHTML=data[index].question
        answers.innerHTML=''
        incorrect_answers.map(e=>{
            answers.innerHTML+=`<li class="animate__animated" onclick="check_correct(this,correct_answer)">${e}</li>`
        }).join("")
    }

const check_correct=(li,correct)=>{
 
    let options = li.parentElement.querySelectorAll('li')
    options.forEach(e => (e.style.pointerEvents = 'none'))
    check_button=true

    if(li.innerText==correct){
        li.style.background = 'green'
        li.classList.add('animate__tada')
        score++
    }
    else{
        li.style.background="red"
        li.classList.add("animate__shakeX")
        options.forEach(e=>{
            if(e.innerText==correct){
                e.style.background="green"
            }
        })
    }

    if (question_count==1){
       next.innerText="Show Result"
       next.onclick=display_end
        scores.push(score)
    }
 
}

const display_end=()=>{

    quiz_window.style.display="none"
    end_window.style.display="flex"
    show_username.innerHTML=`Username:<span>${username}</span>`
    show_score.innerHTML=`Score: <span>${score}</span>`
    show_level.innerHTML=`Level: <span>${level}</span>`
    let max=Math.max(...scores)
    best.innerHTML=`Your best: ${max}`

    if (score<=4){
        end_window.style.backgroundImage="url(img/s.gif)"
        message.innerText='Maybe improve yourself'
      }
      else if (score>4 && score<8){
        end_window.style.backgroundImage="url(img/m.gif)"
        message.innerText=`Good but not enough`
      }
      else if (score>=8 && score<=10){
        end_window.style.backgroundImage="url(img/t.gif)"
        message.innerText=`You are done!`
      }

}

const next_question=()=>{
    question_count--
    if (check_button) {
      index++
      if(index==49){
        index=0
      }
      call_quiz(index, questions)
      check_button=false
    }
}


const again=()=>{
main_window.style.display="flex"
quiz_window.style.display="none"
end_window.style.display="none"
next.innerText="Next"
next.onclick=next_question


input.value=username
question_count=9
check_button=false
score=0
}