$(document).ready(function(){
	$('#signinFrm').prepend('<div class="signin-alert alert alert-error hide">Please enter a valid user name and password to sign in.</div>');
	$('#signin_btn').live('click', function(e){
		//console.log('submitting');
		var obj = $('#signinFrm');
		if(!$('#userId').val() || !$('#userPassword').val()) {
			e.preventDefault();
			//console.log('signin empty');
			obj.find('.signin-alert').fadeIn(200);
		} else {
			obj.find('.signin-alert').hide();
			obj.find('#signin_btn').addClass('signin-btn-submitting').end().find('.signin-spinner').show();
			if(document.signin.remember.checked) {
				dukeCookie.create('userName', document.signin.userId.value, 365);
			}
			else {
				dukeCookie.erase('userName');
			}
		}
	});
});