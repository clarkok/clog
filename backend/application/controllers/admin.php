<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller {
    private function verify(){
        $this->load->model('User_model');
        $user = $this->User_model->verify($_COOKIE["token"]);
        $data = array();
        if (array_key_exists('errno', $user) && $user['errno']){
            $data['errmsg'] = '无效登录，请重新登录';
        }
        if (!array_key_exists('uid', $user) || !array_key_exists('uid', $_COOKIE) || ($user['uid'] != $_COOKIE["uid"])){
            $data['errmsg'] = '疑似伪造登录，请重新登录';
        }
        if (array_key_exists('errmsg', $data)){
            $this->load->view('admin/login.php', $data);
            return null;
        }
        return $user;
    }
    public function index($cid = -1, $page = 1, $app = 10){
        if (!($user = $this->verify())) return;
        $this->load->model('Posts_model');
        $this->load->model('Category_model');

        $data['category_list'] = $this->Category_model->category_list();
        $data['category'] = $this->Category_model->category_by_id($cid);
        $data['cid'] = $cid;
        $data['posts_list'] = $this->Posts_model->category($cid, ($page-1)*$app, $app, false);
        $data['user'] = $user;

        $this->load->view('admin/header.php', $data);
        $this->load->view('admin/index.php', $data);
        $this->load->view('admin/footer.php', $data);
    }
    public function login(){
        if ($user = $this->verify()) {
            $data['location'] = 'admin';
            $this->load->view('admin/login.php', $data);
            return;
        }
        $this->load->model('User_model');
        if (!array_key_exists('_email', $_POST) || !array_key_exists('_pass', $_POST)) {
            $this->load->view('admin/login.php');
            return;
        }
        $res = $this->User_model->login(htmlspecialchars($_POST['_email']), htmlspecialchars($_POST['_pass']));
        if ($res['errno'])
            $data['errmsg'] = $res['errmsg'];
        else{
            $data['token'] = $res['token'];
            $data['location'] = 'admin';
            $data['cookies'] = array(
                (object)array('name'=>'token', 'value'=>$res['token'], 'expire'=>time()+86400),
                (object)array('name'=>'uid', 'value'=>$res['uid'], 'expire'=>time()+86400),
                (object)array('name'=>'nickname', 'value'=>$res['nickname'], 'expire'=>time()+86400)
            );
        }
        $this->load->view('admin/login.php', $data);
    }

    private function publish($arts){
        foreach($arts as $aid) {
            $this->Posts_model->publish($aid);
        }
    }

    private function unpublish($arts){
        foreach($arts as $aid) {
            $this->Posts_model->unpublish($aid);
        }
    }

    public function action(){
        if (!($user = $this->verify())) return;
        $this->load->model('Posts_model');
        foreach ($_POST['ck'] as $key => $value){
            echo "$key=>$value<br />";
        }
        if (!array_key_exists('action', $_POST))
            die('No Action Field');
        if (array_key_exists('ck', $_POST)){
            $arts = array();
            foreach($_POST['ck'] as $key => $value){
                array_push($arts, $key);
            }
            if ($_POST['action'] == 'publish'){
                $this->publish($arts);
            }
            else if($_POST['action'] == 'unpublish') {
                $this->unpublish($arts);
            }
        }
    }

    public function edit($id = 0){
        if (!($user = $this->verify())) return;
        $this->load->model('Category_model');
        $data['category_list'] = $this->Category_model->category_list();
        $data['user'] = $user;
        if ($id) {
            $this->load->model('Posts_model');
            $this->unpublish(array($id));
            $data['post'] = $this->Posts_model->article_by_id($id);
        }
        $this->load->view('admin/header.php', $data);
        $this->load->view('admin/edit.php', $data);
        $this->load->view('admin/footer.php', $data);
    }
}
