<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Category_model extends CI_Model {
    function __construct(){
        parent::__construct();
        $this->load->database();
    }

    function __destruct(){
        $this->db->close();
    }

    /*
     * Return category by id
     * $cid: the id of the wanted category
     */
    public function category_by_id($cid){
        $this->db->reconnect();
        $query = $this->db->query(
            "SELECT * FROM category WHERE id="
            .$this->db->escape($cid)
        );
        if ($query->num_rows() > 0){
            return $query->result()[0];
        }
        else {
            return null;
        }
    }

    /*
     * Return category by name
     * $cname: the name of the wanted category
     */
    public function category_by_name($cname){
        $this->db->reconnect();
        $query = $this->db->query(
            "SELECT * FROM category WHERE name="
            .$this->db->escape($cname)
        );
        if ($query->num_rows() > 0){
            return $query->result()[0];
        }
        else {
            return null;
        }
    }

    /*
     * Return the whole list of category
     */
    public function category_list(){
        $this->db->reconnect();
        $query = $this->db->query(
            "SELECT * FROM category"
        );
        return $query->result();
    }
}
