/********************************************************
 * Name:Jennifer Assaf
 * Date:08/12/2018
 * Description: This is the main javascript source code
 * for the addPatients additional functions. It allows the users
 * to delee patients and filter patients.
 * 
 * Code modified from CS340 Lecture material
 ********************************************************/
function deletePatient(id) {
    $.ajax({
        url: '/addPatient/' + id,
        type: 'DELETE',
        success: function (result) {
            window.location.reload(true);
        }
    })
};

function filterPatients() {
    //get the id of the selected Insurance policys from the filter dropdown
    var policyId = document.getElementById('insurance_filter').value
    //construct the URL and redirect to it
    window.location = '/addPatient/filter/' + parseInt(policyId)
}