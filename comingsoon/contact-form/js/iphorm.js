/*
 * iPhorm jQuery plugin
 * 
 * Version 1.5 - 13th Feb 2011
 */
;(function($) {
	$.fn.iPhorm = function(options) {
		return $(this).each(function() {
			var settings = {};
			
			if (options) {
				$.extend(settings, options);
			}
			
			var $form = $(this);
			$form.submit(function(event) {
				// Set the please wait text to fade in after 2.5 seconds			
				var loadingTimeoutId = setTimeout(function() { $('.submit-button-wrapper .loading', $form).fadeIn('slow'); }, 2500);
				// Prevent the browser submitting the form normally
				event.preventDefault();
				// Bind the form submit to use the ajax form plugin
				$form.ajaxSubmit({
					async: false,
					dataType: 'json',
					data: $("#signupForm").serialize(),
					iframe: true,
					success: function(response) {
						// Remove the please wait timeout and hide it
						clearTimeout(loadingTimeoutId);
						$('.submit-button-wrapper .loading', $form).hide();
						// Check if the form submission was successful
						if (response.type == 'success') {
							if (typeof settings.successRedirect === 'function') {
								settings.successRedirect();
							}
							// Hide any tooltips
							$('.qtip').hide();
							// Fade out the form
							$('.iphorm-container', $form).fadeOut('slow').hide(0, function() {
								// Then fade in the success message
								$('.iphorm-message', $form).hide().html(response.data).fadeIn('slow').show(0, function() {
									// Custom success callback
									if (typeof settings.success === 'function') {
										settings.success();
									}
								});
							});
						} else if (response.type == 'message') {
							// Remove any previous errors from the DOM
							$('.form-errors', $form).remove();
							// Display the message
							$('.iphorm-message', $form).hide().html(response.data).fadeIn('slow');
							// hide on successful addition. Let them refres the page to work with it again. 
							if(response.status == true) {
								$form.fadeOut('slow');
							}
						} else if (response.type == 'error') {
							// Remove any previous errors from the DOM
							$('.form-errors', $form).remove();
							// Go through each element containing errors					
							$.each(response.data, function(index, info) {
								// If there are errors for this element
								if (info.errors != undefined && info.errors.length > 0) {
									// Save a reference to this element									
									$element = $("[name='" + index + "']", $form);
									// If the returned element exists
									if ($element.size()) {
										// Create a blank error list
										var $errorList = $('<ul class="form-errors"></ul>');
										// Go through each error for this field
										$.each(info.errors, function(i, e) {
											// Append the error to the list as a list item
											$errorList.append('<li>' + e + '</li>');
											return false; // Just display one error per element
										});
										// Add the error list after the element's wrapper
										$element.parents('.element-wrapper').append($errorList);
									}
								}
							});
							// Fade all errors in
							$('.form-errors', $form).fadeIn(1000);
							// Custom error callback
							if (typeof settings.error === 'function') {
								settings.error();
							}
						}
					}
				}); // End ajaxSubmit()
			}); // End form.submit()
		}); // End this.each()
	};
})(jQuery);