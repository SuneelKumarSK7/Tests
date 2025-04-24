// jQuery code to handle the form submission and table loading
$(document).ready(function () {
    tableLoad();
})

// Load all student data when the page is ready
function tableLoad() {
    // console.log('tableLoad called')
    $.ajax({
        url: "process.php",
        type: "POST",
        dataType: "JSON",
        data: {
            action: 'getAllStudentData'
        },
        success: function (response) {
            // console.log(response);
            let studentData = "";

            if (response.success && response.data.length > 0) {
                $.each(response.data, function (key, value) {

                    studentData += `<tr>
                        <th scope="row">${value.id}</th>
                        <th scope="row">${value.name}</th>
                        <th scope="row">${value.email}</th>
                        <th scope="row">${value.phone}</th>
                        <th scope="row">${value.course}</th>
                        <th>
                            <a class="btn btn-primary mb-3" data-bs-viewId="${value.id}" data-bs-toggle="modal"
                                data-bs-target="#singleDataModel" href="" role="button">View</a>

                            <a class="btn btn-info mb-3" data-bs-updateId="${value.id}" data-bs-toggle="modal"
                                data-bs-target="#singleUpdateModel" href="" role="button"
                                id="updateId">Update</a>

                            <a class="btn btn-danger mb-3" onclick="deleteStudent('${value.id}')" data-bs-deleteId='{{ $userData->id }}' href="#"
                                role="button">Delete</a>
                        </th>
                    </tr>`;
                })

                $('#student-table-Body').html("")
                $('#student-table-Body').append(studentData)
            } else {
                $('#student-table-Body').html('<tr><td colspan="6">No Data Found</td></tr>');
            }
        }
    })
}

// add student
$(document).on('submit', '#addForm', function (e) {
    // console.log('add clicked');
    e.preventDefault();

    $.ajax({
        url: "process.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            action: 'add',
            name: $('#addNameInp').val(),
            email: $('#addEmailInp').val(),
            phone: $('#addPhoneInp').val(),
            course: $('#addCourseSelect').val(),
        },
        success: function (response) {
            // console.log(response);
            if (response.success) {
                tableLoad();
                $('#addForm')[0].reset();
                $('#addStudent').modal('hide');

            } else {
                if (response.message) {
                    $('#addError_message').html(response.message);
                } else {
                    $('#addError_message').html('');
                }

                if (response.errors.email) {
                    $('#addEmailInp').addClass('is-invalid');
                    $('#addEmail-error').html(response.errors.email);
                } else {
                    $('#addEmailInp').removeClass('is-invalid');
                    $('#addEmail-error').html('');
                }
                if (response.errors.phone) {
                    $('#addPhoneInp').addClass('is-invalid');
                    $('#addPhone-error').html(response.errors.phone);
                } else {
                    $('#addPhoneInp').removeClass('is-invalid');
                    $('#addPhone-error').html('');
                }
                if (response.errors.name) {
                    $('#addNameInp').addClass('is-invalid');
                    $('#addName-error').html(response.errors.name);
                } else {
                    $('#addNameInp').removeClass('is-invalid');
                    $('#addName-error').html('');
                }
                if (response.errors.course) {
                    $('#addCourseSelect').addClass('is-invalid');
                    $('#addCourse-error').html(response.errors.course);
                } else {
                    $('#addCourseSelect').removeClass('is-invalid');
                    $('#addCourse-error').html('');
                }
            }

        }
    });
});

// show students data 
$('#singleDataModel').on('show.bs.modal', function (event) {
    // Get the button that triggered the modal
    var button = $(event.relatedTarget);
    var id = button.data('bs-viewid');

    // Fetch student data
    $.ajax({
        url: "process.php",
        method: 'POST',
        dataType: 'JSON',
        data: {
            action: 'getSingleStudentData',
            id: id
        },
        success: function (response) {
            // console.log(response.data);

            // Update modal content
        $('#singleDataModel .modal-body').html(`
          Name: ${response.data.name}<br>
          Email: ${response.data.email}<br>
          Phone: ${response.data.phone}<br>
          Course: ${response.data.course}
        `);
        },
        error: function () {
            $('#singleDataModel .modal-body').html('Error fetching data.');
        }
    });
});


// When the update modal is about to show
$('#singleUpdateModel').on('show.bs.modal', function (event) {
    // Get the button that triggered the modal
    var button = $(event.relatedTarget);
    var id = button.data('bs-updateid');

    // Fetch student data
    $.ajax({
        url: "process.php",
        method: 'POST',
        dataType: 'JSON',
        data: {
            action: 'getSingleStudentData',
            id: id
        },
        success: function (response) {
            // Populate modal with update form
            $('#singleUpdateModel .modal-body').html(`
          <form id="updateForm">
                    <p class="text-danger text-center" id="Error_message"></p>

            <input type="hidden" id="studentId" value="${response.data.id}">
            <div class="mb-3">
              <label for="nameInp" class="form-label">Name</label>
              <input type="text" name="name" value="${response.data.name}" class="form-control" id="nameInp">
              <span class="text-danger" id="name-error"></span>
            </div>
            <div class="mb-3">
              <label for="emailInp" class="form-label">Email</label>
              <input type="email" name="email" value="${response.data.email}" class="form-control" id="emailInp">
              <span class="text-danger" id="email-error"></span>
            </div>
            <div class="mb-3">
                <label for="phoneInp" class="form-label">Phone</label>
                <input type="text" name="phone" value="${response.data.phone}" class="form-control" id="phoneInp">
                <span class="text-danger" id="phone-error"></span>
            </div>
            <div class="mb-3">
                <label for="courseInp" class="form-label">Course</label>
                <select class="form-select" id="courseSelect" name="course" required>
                    <option disabled>Choose a course</option>
                        <option value="HTML" ${response.data.course === 'HTML' ? 'selected' : ''}>HTML</option>
                        <option value="CSS" ${response.data.course === 'CSS' ? 'selected' : ''}>CSS</option>
                        <option value="JavaScript" ${response.data.course === 'JavaScript' ? 'selected' : ''}>JavaScript</option>
                        <option value="PHP" ${response.data.course === 'PHP' ? 'selected' : ''}>PHP</option>
                        <option value="Bootstrap" ${response.data.course === 'Bootstrap' ? 'selected' : ''}>Bootstrap</option>
                        <option value="Laravel" ${response.data.course === 'Laravel' ? 'selected' : ''}>Laravel</option>
                </select>
                <span class="text-danger" id="course-error"></span>

            </div>

            <button type="submit" class="btn btn-primary" id="updateBtn">Submit</button>
          </form>
        `);
        },
        error: function () {
            $('#singleUpdateModel .modal-body').html('<p class="text-danger">Failed to fetch user data.</p>');
        }
    });
});


// Handle update form submission
$(document).on('submit', '#updateForm', function (e) {
    e.preventDefault();
    var id = $('#studentId').val(); // Get user ID from the hidden input

    $.ajax({
        url: "process.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            action: 'update',
            id: id,
            name: $('#nameInp').val(),
            email: $('#emailInp').val(),
            phone: $('#phoneInp').val(),
            course: $('#courseSelect').val(),
        },
        success: function (response) {

            if (response.success) {
                tableLoad();
                $('#updateForm')[0].reset();
                $('#singleUpdateModel').modal('hide');

            } else {
                if (response.message) {
                    $('#Error_message').html(response.message);
                } else {
                    $('#Error_message').html('');
                }

                if (response.errors.email) {
                    $('#emailInp').addClass('is-invalid');
                    $('#email-error').html(response.errors.email);
                } else {
                    $('#emailInp').removeClass('is-invalid');
                    $('#email-error').html('');
                }
                if (response.errors.phone) {
                    $('#phoneInp').addClass('is-invalid');
                    $('#phone-error').html(response.errors.phone);
                } else {
                    $('#phoneInp').removeClass('is-invalid');
                    $('#phone-error').html('');
                }
                if (response.errors.name) {
                    $('#nameInp').addClass('is-invalid');
                    $('#name-error').html(response.errors.name);
                } else {
                    $('#nameInp').removeClass('is-invalid');
                    $('#name-error').html('');
                }
                if (response.errors.course) {
                    $('#courseSelect').addClass('is-invalid');
                    $('#course-error').html(response.errors.course);
                } else {
                    $('#courseSelect').removeClass('is-invalid');
                    $('#course-error').html('');
                }
            }
           
        }
    });
});

// handel delete operations
function deleteStudent(id) {
    $.ajax({
        url: "process.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            action: 'delete',
            id: id,
        },
        success: function (response) {
            if (response.success) {
                tableLoad();
            }

        }
    });
}

// Handle search functionality
$(document).on('click', '#search_btn', function (e) {
    e.preventDefault();
    let searchValue = $('#search_input').val();
    $.ajax({
        url: "process.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            action: 'search',
            searchValue: searchValue,
        },
        success: function (response) {
            // console.log(response);
            let studentData = "";

            if (response.success && response.data.length > 0) {
                $.each(response.data, function (key, value) {

                    studentData += `<tr>
                        <th scope="row">${value.id}</th>
                        <th scope="row">${value.name}</th>
                        <th scope="row">${value.email}</th>
                        <th scope="row">${value.phone}</th>
                        <th scope="row">${value.course}</th>
                        <th>
                            <a class="btn btn-primary mb-3" data-bs-viewId="${value.id}" data-bs-toggle="modal"
                                data-bs-target="#singleDataModel" href="" role="button">View</a>

                            <a class="btn btn-info mb-3" data-bs-updateId="${value.id}" data-bs-toggle="modal"
                                data-bs-target="#singleUpdateModel" href="" role="button"
                                id="updateId">Update</a>

                            <a class="btn btn-danger mb-3" onclick="deleteStudent('${value.id}')" data-bs-deleteId='{{ $userData->id }}' href="#"
                                role="button">Delete</a>
                        </th>
                    </tr>`;
                })

                $('#student-table-Body').html("")
                $('#student-table-Body').append(studentData)
            } else {
                $('#student-table-Body').html('<tr><td colspan="6">No Data Found</td></tr>');
            }
        }
    });
})






















// function register(e) {
//     // console.log('register clicked')
//     e.preventDefault();
//     let action = document.querySelector('#userRegister_action').value;
//     let userEmail = document.querySelector('#userRegister_email').value;
//     let userPass = document.querySelector('#userRegister_password').value;
//     let userFName = document.querySelector('#userRegister_firstName').value;
//     let userLName = document.querySelector('#userRegister_lastName').value;

//     function userRegister(action, userFirstName, userLastName, userEmail, userPass) {
//         // console.log('clicked');
//         $.ajax({
//             url: "sky9EcommerceUserLogin.php",
//             type: "POST",
//             dataType: "JSON",
//             data: {
//                 action: action,
//                 firstName: userFirstName,
//                 lastName: userLastName,
//                 email: userEmail,
//                 pass: userPass
//             },
//             success: function (data) {

//                 if (data.success) {
//                     if (data.message) {
//                         document.querySelector('#registerError_message').innerHTML = data.message;
//                         document.querySelector('#registerError_message').style.color = 'green';
//                     }
//                     document.querySelector('#firstName_error').innerHTML = '';
//                     document.querySelector('#lastName_error').innerHTML = '';
//                     document.querySelector('#registerEmail_error').innerHTML = '';
//                     document.querySelector('#registerPassword_error').innerHTML = '';
//                     document.querySelector('#user_registration_form').reset();

//                 } else {
//                     if (data.message) {
//                         document.querySelector('#registerError_message').innerHTML = data.message;
//                         document.querySelector('#registerError_message').style.color = 'red';
//                     } else {
//                         document.querySelector('#registerError_message').innerHTML = '';
//                     }

//                     if (data.errors.email) {
//                         document.querySelector('#registerEmail_error').innerHTML = data.errors.email;
//                     } else {
//                         document.querySelector('#registerEmail_error').innerHTML = '';
//                     }
//                     if (data.errors.password) {
//                         document.querySelector('#registerPassword_error').innerHTML = data.errors.password;
//                     } else {
//                         document.querySelector('#registerPassword_error').innerHTML = '';
//                     }
//                     if (data.errors.firstName) {
//                         document.querySelector('#firstName_error').innerHTML = data.errors.firstName;
//                     } else {
//                         document.querySelector('#firstName_error').innerHTML = '';
//                     }
//                     if (data.errors.lastName) {
//                         document.querySelector('#lastName_error').innerHTML = data.errors.lastName;
//                     } else {
//                         document.querySelector('#lastName_error').innerHTML = '';
//                     }

//                 }
//             }
//         })
//     };
//     userRegister(action, userFName, userLName, userEmail, userPass);
// }