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
        if (preg_match($reg, $content, $matches)) {
            $content = $matches[0];
        }
        $linkreg = '#<(/|)a.*?>#';
        $content = preg_replace($linkreg, '', $content);
        $scriptreg = '#<script.*?</script>#';
        $content = preg_replace($scriptreg, '', $content);
        $divreg = '#<(/|)div.*?>#';
        $content = preg_replace($divreg, '', $content);
        if (strlen($content) >= 100)
            if ($pos = strpos($content, '</p>', 100))
                $content = substr($content, 0, $pos).'<p class="more">Read More</p>';
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
    public function category($cid, $start, $max, $publish=true){
        $this->db->reconnect();
        if ($cid >= 0){
            if ($publish)
                $query = $this->db->query(
                    "SELECT * FROM posts WHERE cid="
                    .$this->db->escape($cid)." and publish=1");
            else
                $query = $this->db->query(
                    "SELECT * FROM posts WHRER cid="
                    .$this->db->escape($cid));
        }
        else {
            if ($publish)
                $query = $this->db->query(
                    "SELECT * FROM posts WHERE publish=1");
            else
                $query = $this->db->query(
                    "SELECT * FROM posts");
        }
        $res = array_reverse($query->result());
        $res = array_slice($res, $start, $max);
        foreach($res as &$art){
            $art->content = $this->summary($art->content);
        }
        return $res;
    }
    public function publish($aid){
        $this->db->reconnect();
        $this->db->query('UPDATE posts SET publish=1 WHERE id='.$this->db->escape($aid));
    }
    public function unpublish($aid){
        $this->db->reconnect();
        $this->db->query('UPDATE posts SET publish=0 WHERE id='.$this->db->escape($aid));
    }
    public function add($art, $publish){
        $this->db->reconnect();
        $this->db->query('INSERT INTO posts (publish, title, author, auid, date, category, cid, content) VALUES ');
    }
}
