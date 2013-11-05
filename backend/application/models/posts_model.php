<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Posts_model extends CI_Model {
    function __construct(){
        parent::__construct();
        $this->load->database();
    }

    function __destruct(){
        $this->db->close();
    }

    /*
     * Trunc the article by <!-- MORE --> if exists
     * $content: the content
     */
    private function summary($content){
        $reg = '#.*?<!--\s*MORE\s*-->#i';
        if (preg_match($reg, $content, $matches))
            return $matches[0];
        else
            return $content;
    }

    /*
     * Return the article by id
     * $aid: the id of the article
     */
    public function article_by_id($aid){
        $this->db->reconnect();
        $query = $this->db->query(
            "SELECT * FROM posts WHERE publish=1 AND id="
            .$this->db->escape($aid));
        if ($query->num_rows() > 0){
            return $query->result()[0];
        }
        else {
            return null;
        }
    }

    /*
     * Return the list of articles with summary of content in an category
     * $cid: the id of the category
     * $start: the start of the list
     * $max: max length of the list
     */
    public function category($cid, $start, $max){
        $this->db->reconnect();
        if ($cid >= 0){
            $query = $this->db->query(
                "SELECT * FROM posts WHERE cid="
                .$this->db->escape($cid)." and publish=1");
        }
        else {
            $query = $this->db->query(
                "SELECT * FROM posts WHERE publish=1");
        }
        $res = array_slice($query->result(), $start, $max);
        foreach($res as &$art){
            $art->content = $this->summary($art->content);
        }
        return $res;
    }
}
