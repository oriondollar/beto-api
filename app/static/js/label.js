let elements = Object.values(document.querySelectorAll('.entity'));

let span1 = document.createElement('span');
span1.className = 'insert';
span1.innerHTML = "<strong> test </strong>";
//
// let span2 = span1.cloneNode(true);
// let span3 = span1.cloneNode(true);
// let span4 = span1.cloneNode(true);
// let spans = [span1, span2, span3, span4];

// console.log(document.getElementById('abstracttext').innerHTML);
// console.log(document.elementFromPoint(300, 300));

document.addEventListener('mouseover', function(event) {
  if (event.target.dataset.highlight != undefined) {
    event.target.classList.add('highlight');
    event.target.style.cursor = 'pointer';
  }
});

document.addEventListener('mouseout', function(event) {
  if (event.target.dataset.highlight != undefined) {
    event.target.classList.remove('highlight');
  }
})

$(".entity").click(function(){
  alert('clicked');
});

$(document).click(function(event){
  if (event.target.classList.contains('bgimg-1')) {
    alert('clicked body');
  }
  return 0;
});
