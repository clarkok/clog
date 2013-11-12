<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Ajax extends CI_Controller {
    /* 
     * Return An Article 
     * $article: the id of the article 
     */
    public function article($article = '-1'){
        $this->load->model('Posts_model');
        $res = $this->Posts_model->article_by_id($article);
        if ($res) {
            $data['article'] = $res;
            $this->load->view('ajax/article.php', $data);
        }
        else {
            $this->load->view('ajax/404.php');
        }
    }
    /*
     * Return A list of articles with some of the comtent
     * $category: the id of the category, -1 => All, 0 => uncategoried
     * $page: the page of the list
     * $app: articles per page
     */
    public function category($category='-1', $page="1", $app=10){
        $this->load->model('Posts_model');
        if ($category > 0) {
            $this->load->model('Category_model');
            $cate = $this->Category_model->category_by_id($category);
            if ($cate){
                $cname = $cate->name;
            }
            else {
                $this->load->view('ajax/404.php');
                return;
            }
        }
        else {
            if ($category == -1)
                $cname = 'All';
            else
                $cname = 'Uncategorized';
        }
        $res = $this->Posts_model->category($category, ($page-1)*$app, $app);
        $data['cid'] = $category;
        $data['category'] = $cname;
        $data['page'] = $page;
        $data['posts'] = $res;
        $this->load->view('ajax/category.php', $data);
    }
    /*
     * Return the list of categories
     */
    public function categories(){
        $this->load->model('Category_model');
        $data['catagory_list'] = $this->Category_model->category_list();
        $this->load->view('ajax/category_list.php', $data);
    }
    /*
     * Return the list of comment of an article
     * $aid: the id of the article
     * $page: the page of the list
     * $cpp: comments per page
     */
    public function comment($aid=0, $page=1, $cpp=10){
        $this->load->model('Comment_model');
        $data['comment'] = $this->Comment_model
            ->comment_by_article($aid, ($page-1)*$cpp, $cpp);
        $this->load->view('ajax/comment.php', $data);
    }

/*
    public function users($action){
        $this->load->model('User_model');
        if ($action == 'login') {
            if (!isset($_POST['_email'])) {
                $data['data'] = array(
                    'errno' => 1,
                    'errmsg' => 'Invalid Email'
                );
                $this->load->view('ajax/error.php', $data);
                return;
            }
            if (!isset($_POST['_passhash'])) {
                $data['data'] = array(
                    'errno' => 1,
                    'errmsg' => 'Invalid Pass'
                );
                $this->load->view('ajax/error.php', $data);
                return;
            }
            $res = $this->User_model->addUser(htmlspecialchars($_POST['_email']), htmlspecialchars($_PSOT['_passhash']));
            $data['data'] = $res;
            $this->load->view('ajax/user.php', $data);
        }
        elseif ($action == 'signup') {
            if (!isset($_POST['_email'])) {
                $data['data'] = array(
                    'errno' => 1,
                    'errmsg' => 'Invalid Email'
                );
                $this->load->view('ajax/error.php', $data);
                return;
            }
            if (!isset($_POST['_nickname'])) {
                $data['data'] = array(
                    'errno' => 1,
                    'errmsg' => 'Invalid Nickname'
                );
                $this->load->view('ajax/error.php', $data);
                return;
            }
        }
    }
 */
}
