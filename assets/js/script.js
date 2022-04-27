function deleteSharedAcc(ele) {
    $('#deleteSharedAccModal').modal('show');

    const id = $(ele).data('id');
    const i = $(ele).data('suid');
    $('#deleteSharedAccConfirmBtn').on('click', function() {
        $.ajax({
            type: 'GET',
            url: '/' + id + '/' + i,
            success: function () {
                location.assign('/');
            }
        });
        $('#deleteCourseModal').modal('hide');
        location.assign('/');
    });
}

function editSharedAccount(ele) {
    $('#editSharedAcc').find('input#inputEditSharedAccName').val($(ele).data('name'));
    $('#editSharedAcc').modal('show');
    const url = '/editShAcc/' + $(ele).data('id');
    const editAccError = document.getElementById('editAccError');

    $('#editSharedAcc').on('submit', async (e) => {
        e.preventDefault();

        editAccError.textContent = ''

        const name = $('#inputEditSharedAccName').val();
        try {
            const res = await fetch( url, {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: { 'Content-type': 'application/json' }
            })
    
            const data = await res.json();
            console.log(data);
            if (data.errors) {
                editAccError.textContent = data.errors;
            }
            if (data.editted) {
                accountError.innerHTML = `<span style="color:green;">Edited successfully<span>`;
                $('#editSharedAcc').modal('hide');
                location.assign('/dashboard');
            }
        } catch (err) {
            console.log(err);
        }
    });
}

const expenseOptions = ['Entertainment', 'Food', 'Rent', 'Tax', 'Travel', 'Other'];
const incomeOptions = ['Earned', 'Investment', 'Passive'];
function getValue(radio) {
    const selectBox = document.getElementById('transactioCategory');
    if (radio.value === 'Expense') {
        removeAll(selectBox);
        
        for(var n in expenseOptions) {
            const newOption = document.createElement('option');
            const optionText = document.createTextNode(expenseOptions[n]);
            newOption.appendChild(optionText);
            newOption.setAttribute('value', expenseOptions[n]);

            selectBox.appendChild(newOption);
        } 
    }

    if (radio.value === 'Income') {
        removeAll(selectBox);
        for(var n in incomeOptions) {
            const newOption = document.createElement('option');
            const optionText = document.createTextNode(incomeOptions[n]);
            newOption.appendChild(optionText);
            newOption.setAttribute('value', incomeOptions[n]);

            selectBox.appendChild(newOption);
        } 
    }
}
function removeAll(selectBox) {
    while (selectBox.options.length > 0) {
        selectBox.remove(0);
    }
}