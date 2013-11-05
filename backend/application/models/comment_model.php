<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Comment_model extends CI_Model {
    function __construct(){
        parent::__construct();
        $this->load->database();
    }

    function __destruct(){
        $this->db->close();
    }

    /*
     * Return the comments of an article
     * $aid: id of the article
     * $start: the start of list
     * $max: the max number of list
     */
    public function comment_by_article($aid, $start, $max){
        $this->db->reconnect();
        $query = $this->db->query(
            "SELECT * FROM comment WHERE aid="
            .$this->db->escape($aid)." and state=1"
        );
        return array_slice($query->result(), $start, $max);
    }
}
