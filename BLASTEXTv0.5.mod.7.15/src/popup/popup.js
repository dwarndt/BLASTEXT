
let activeItem = null
const dragItems = document.querySelectorAll('.dragItem');

// attach the dragstart event handler
dragItems.forEach(dragItem =>{
    dragItem.addEventListener('dragstart', dragStart);
    dragItem.addEventListener('dragend', dragEnd)
});

// handle the dragstart

function dragStart(e) {
    console.log('clear');
    activeItem = this;
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);

}
function dragEnd(e){
    this.className = 'dragItem'
    dragItem = null;
}
function dragDrop() {
    console.log(activeItem)
    console.log('drag dropped');
    if(activeItem == null){
        return
    }
    this.append(activeItem);
    if(document.getElementById("inputField").children.length != 1){
        console.log('hiding...')
        nullItem1.style.display = 'none';
    }
    else if(document.getElementById("inputField").children.length == 1){
        console.log('hiding...')
        nullItem1.style.display = 'block';
    }
}

const fields = document.querySelectorAll(".field");

fields.forEach(field =>{
    field.addEventListener('dragenter', dragEnter)
    field.addEventListener('dragover', dragOver);
    field.addEventListener('dragleave', dragLeave);
    field.addEventListener('drop', dragDrop);
});

function dragEnter(e) {
    e.preventDefault();
}

function dragOver(e) {
    e.preventDefault();
    console.log('drag over registered')
}

function dragLeave(e) {

}
