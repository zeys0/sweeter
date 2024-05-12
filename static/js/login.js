// clear function
function clear_value() {
  $("#input-username").val("");
  $("#input-password").val("");
  $("#input-username-sign-up").val("");
  $("#input-password-sign-up").val("");
  $("#input-password2").val("");
}

function sign_in() {
  let username = $("#input-username").val();
  let password = $("#input-password").val();

  if (username === "") {
    $("#help-id-login").text("Please input your id.");
    $("#input-username").focus();
    return;
  } else {
    $("#help-id-login").text("");
  }

  if (password === "") {
    $("#help-password-login").text("Please input your password.");
    $("#input-password").focus();
    return;
  } else {
    $("#help-password-login").text("");
  }

  $.ajax({
    type: "POST",
    url: "/sign_in",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      if (response.result === "success") {
        alert("Login succes");
        $.cookie("mytoken", response["token"], { path: "/" });
        window.location.replace("/");
      } else {
        alert(response["msg"]);
      }
    },
  });
}

function sign_up() {
  let helpPassword = $("#help-password");
  let inputPassword = $("#input-password-sign-up");
  let helpPassword2 = $("#help-password2");
  let inputPassword2 = $("#input-password2");

  let username = $("#input-username-sign-up").val();
  let password = inputPassword.val();
  let password2 = inputPassword2.val();

  let helpId = $("#help-id");
  if (helpId.hasClass("is-danger")) {
    alert("Please check your id");
    return;
  } else if (!helpId.hasClass("is-success")) {
    alert("please double check your id,something is wrong");
    return;
  }

  if (password === "") {
    helpPassword
      .text("Please enter your password")
      .removeClass("is-safe")
      .addClass("is-danger");
    inputPassword.focus();
    return;
  } else if (!is_password(password)) {
    helpPassword
      .text(
        " For your password, please enter 8-20 English characters, numbers, or the following special characters (!@#$%^&*)"
      )
      .removeClass("is-safe")
      .addClass("is-danger");
    inputPassword.focus();
    return;
  } else {
    helpPassword
      .text("This password can be used")
      .removeClass("is-danger")
      .addClass("is-success");
  }

  if (password2 === "") {
    helpPassword2
      .text("Please enter in your password again")
      .removeClass("is-safe")
      .addClass("is-danger");
    inputPassword2.focus();
    return;
  }
  $.ajax({
    type: "POST",
    url: "sign_up/save",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      alert("You are registered Nice!");
      window.location.replace("/login");
    },
  });
}

function toggle_sign_up() {
  $("#div-sign-in").toggleClass("is-hidden");
  $("#sign-up-box").toggleClass("is-hidden");
}

function is_nickname(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
  return regExp.test(asValue);
}

function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

function check_dup() {
  let inputUsername = $("#input-username-sign-up");
  let helpId = $("#help-id");
  let username = inputUsername.val();

  if (username === "") {
    helpId
      .text("Please enter your id")
      .removeClass("is-safe")
      .addClass("is-danger");
    inputUsername.focus();
    return;
  }

  if (!is_nickname(username)) {
    helpId
      .text(
        "For your id, please enter 2-10 English characters, numbers, or the following special characters (._-)"
      )
      .removeClass("is-safe")
      .addClass("is-danger");
    inputUsername.focus();
    return;
  }

  helpId.addClass("is-loading");

  $.ajax({
    type: "POST",
    url: "/sign_up/check_dup",
    data: {
      username_give: username,
    },
    success: function (response) {
      if (response.exists) {
        helpId
          .text("This id is already in user")
          .removeClass("is-safe")
          .addClass("is-danger");
        inputUsername.focus();
      } else {
        helpId
          .text("This id is available for you")
          .removeClass("is-danger")
          .addClass("is-success");
      }
      helpId.removeClass("is-loading");
    },
  });
}
