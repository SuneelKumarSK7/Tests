<?php

include 'connection.php';
header('Content-Type: application/json'); // Set the response type to JSON

$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

$requirement = true;

if (!empty($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'getAllStudentData') {
        $sql = "SELECT * FROM students";
        $query = mysqli_prepare($con, $sql);
        mysqli_stmt_execute($query);
        $result = mysqli_stmt_get_result($query);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
            $response['success'] = true;
            $response['message'] = "Data fetched successfully";
            $response['data'] = $row;
        } else {
            $response['message'] = "Query execution failed";
        }
    } elseif ($action === 'getSingleStudentData') {
        // Check if ID is provided
        if (!empty($_POST['id'])) {
            
            $id = $_POST['id'];
            $sql = "SELECT * FROM students WHERE id=?";
            $query = mysqli_prepare($con, $sql);
            mysqli_stmt_bind_param($query, "i", $id);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
    
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $response['success'] = true;
                $response['message'] = "Data fetched successfully";
                $response['data'] = $row;
            } else {
                $response['message'] = "Query execution failed";
            }
        }else {
            $response['message'] = "Id is required";
        }
    } elseif ($action === 'add') {

        // name validation
        if (empty($_POST['name'])) {
            $nameErr = "Name is required";
            $requirement = false;
            $response['errors']['name'] = $nameErr;
        } else {
            $name = ucwords($_POST['name']);

            if (!preg_match("/^[a-zA-Z-' ]*$/", $name)) {
                $nameErr = "Only letters allowed";
                $requirement = false;
                $response['errors']['name'] = $nameErr;
            } elseif (strlen($name) > 12) {
                $nameErr = "Name length allowd only less than 12 charector";
                $requirement = false;
                $response['errors']['name'] = $nameErr;
            } elseif (strlen($name) < 3) {
                $nameErr = "Name length aloud greater than 2 charctor";
                $requirement = false;
                $response['errors']['name'] = $nameErr;
            }
        }

        // Email validation
        if (empty($_POST['email'])) {
            $emailerr = "Email is required";
            $requirement = false;
            $response['errors']['email'] = $emailerr;
        } else {
            $email = $_POST['email'];

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $emailerr = "Invalid email format";
                $requirement = false;
                $response['errors']['email'] = $emailerr;
            }
        }

        // Phone validation
        if (empty($_POST['phone'])) {
            $phoneErr = "Phone number is required.";
            $requirement = false;
            $response['errors']['phone'] = $phoneErr;
        } else {
            $phone = $_POST['phone'];
            if (!is_numeric($phone)) {
                $phoneErr = "Phone number must contain only digits.";
                $requirement = false;
                $response['errors']['phone'] = $phoneErr;
            } elseif (strlen($phone) < 10 || strlen($phone) > 10) {
                $phoneErr = "Phone number must be 10 digits.";
                $requirement = false;
                $response['errors']['phone'] = $phoneErr;
            }
        }

        // Course validation
        if (empty($_POST['course'])) {
            $courseErr = "course is required";
            $requirement = false;
            $response['errors']['course'] = $courseErr;
        } else {
            $course = $_POST['course'];

            if (!preg_match("/^[a-zA-Z-' ]*$/", $course)) {
                $courseErr = "Only letters allowed";
                $requirement = false;
                $response['errors']['course'] = $courseErr;
            } elseif (strlen($course) > 12) {
                $courseErr = "course length allowd only less than 12 charector";
                $requirement = false;
                $response['errors']['course'] = $courseErr;
            } elseif (strlen($course) < 3) {
                $courseErr = "course length aloud greater than 2 charctor";
                $requirement = false;
                $response['errors']['course'] = $courseErr;
            }
        }

        if ($requirement) {
            // Insert query
            $sqlAdd = "INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)";

            $query = mysqli_prepare($con, $sqlAdd);
            mysqli_stmt_bind_param($query, "ssss", $name, $email, $phone, $course);
            if (mysqli_stmt_execute($query)) {
                // Success response
                $response['success'] = true;
                $response['message'] = "Data inserted successfully";
            } else {
                // Error response
                $response['message'] = "Failed to insert data";
            }
        } else {
            $response['message'] = "Validation failed";
        }
    } elseif ($action === 'update') {

        if (!empty($_POST['id'])) {
            $id = $_POST['id'];

            // name validation
            if (empty($_POST['name'])) {
                $nameErr = "Name is required";
                $requirement = false;
                $response['errors']['name'] = $nameErr;
            } else {
                $name = ucwords($_POST['name']);

                if (!preg_match("/^[a-zA-Z-' ]*$/", $name)) {
                    $nameErr = "Only letters allowed";
                    $requirement = false;
                    $response['errors']['name'] = $nameErr;
                } elseif (strlen($name) > 12) {
                    $nameErr = "Name length allowd only less than 12 charector";
                    $requirement = false;
                    $response['errors']['name'] = $nameErr;
                } elseif (strlen($name) < 3) {
                    $nameErr = "Name length aloud greater than 2 charctor";
                    $requirement = false;
                    $response['errors']['name'] = $nameErr;
                }
            }

            // Email validation
            if (empty($_POST['email'])) {
                $emailerr = "Email is required";
                $requirement = false;
                $response['errors']['email'] = $emailerr;
            } else {
                $email = $_POST['email'];

                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $emailerr = "Invalid email format";
                    $requirement = false;
                    $response['errors']['email'] = $emailerr;
                }
            }

            // Phone validation
            if (empty($_POST['phone'])) {
                $phoneErr = "Phone number is required.";
                $requirement = false;
                $response['errors']['phone'] = $phoneErr;
            } else {
                $phone = $_POST['phone'];
                if (!is_numeric($phone)) {
                    $phoneErr = "Phone number must contain only digits.";
                    $requirement = false;
                    $response['errors']['phone'] = $phoneErr;
                } elseif (strlen($phone) < 10 || strlen($phone) > 10) {
                    $phoneErr = "Phone number must be 10 digits.";
                    $requirement = false;
                    $response['errors']['phone'] = $phoneErr;
                }
            }

            // Course validation
            if (empty($_POST['course'])) {
                $courseErr = "course is required";
                $requirement = false;
                $response['errors']['course'] = $courseErr;
            } else {
                $course = $_POST['course'];

                if (!preg_match("/^[a-zA-Z-' ]*$/", $course)) {
                    $courseErr = "Only letters allowed";
                    $requirement = false;
                    $response['errors']['course'] = $courseErr;
                } elseif (strlen($course) > 12) {
                    $courseErr = "course length allowd only less than 12 charector";
                    $requirement = false;
                    $response['errors']['course'] = $courseErr;
                } elseif (strlen($course) < 3) {
                    $courseErr = "course length aloud greater than 2 charctor";
                    $requirement = false;
                    $response['errors']['course'] = $courseErr;
                }
            }
        } else {
            $response['message'] = "Id is required";
            $requirement = false;
        }

        if ($requirement) {
            // Update query
            $sqlUpdate = "UPDATE students SET name=?, email=?, phone=?, course=? WHERE id=?";
            $query = mysqli_prepare($con, $sqlUpdate);
            mysqli_stmt_bind_param($query, "ssssi", $name, $email, $phone, $course, $id);
            if (mysqli_stmt_execute($query)) {
                // Success response
                $response['success'] = true;
                $response['message'] = "Data updated successfully";
            } else {
                // Error response
                $response['message'] = "Failed to update data";
            }
        } else {
            $response['message'] = "Validation failed";
        }
    } elseif ($action === 'delete') {
        if (!empty($_POST['id'])) {
            $id = $_POST['id'];

            $sql = "DELETE FROM students WHERE id=?";
            $query = mysqli_prepare($con, $sql);
            mysqli_stmt_bind_param($query, "i", $id);
            if (mysqli_stmt_execute($query)) {
                $response['success'] = true;
                $response['message'] = "Data deleted successfully";
            } else {
                $response['message'] = "Failed to delete data";
            }
        } else {
            $response['message'] = "Id is required";
        }
    } elseif ($action === 'search') {
        if (!empty($_POST['searchValue'])) {
            $search = $_POST['searchValue'];
            $sql = "SELECT * FROM students WHERE name LIKE ? OR course LIKE ?";
            $query = mysqli_prepare($con, $sql);
            $searchParam = "%$search%";
            mysqli_stmt_bind_param($query, "ss", $searchParam, $searchParam);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
                $response['success'] = true;
                $response['message'] = "Data fetched successfully";
                $response['data'] = $row;
            } else {
                $response['message'] = "No results found";
            }
        } else {
            $response['message'] = "Search term is required";
        }
    }
     else {
        $response['message'] = "Invalid action";
    }
} else {
    $response['message'] = "No action provided";
}


echo json_encode($response);
