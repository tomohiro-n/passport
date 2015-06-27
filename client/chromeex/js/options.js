document.getElementById('save').addEventListener('click', regist_user_id);
document.getElementById('user_id').textContent = '';

function regist_user_id(){
  var user_id = 'test_user';
  var key = 'user_id';
  localStorage.setItem(key, user_id);
  document.getElementById('user_id').textContent = localStorage.getItem(key);
};
