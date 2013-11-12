<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
class User_model extends CI_Model {
    function __construct(){
        parent::__construct();
        $this->load->database();
        $this->load->library('encrypt');
    }

    function __destruct(){
        $this->db->close();
    }

    private function _randPass(){
        $res = '';
        for ($i=0; $i<16; $i++){
            $res .= 'a'+rand(0, 25);
        }
        return $res;
    }

    private function hashUserPass($email, $nickname) {
        return $this->encrypt->sha1($ranp.$email);
    }

    private function getToken($uid) {
        return $this->encrypt->sha1($uid.time());
    }

    public function addUser($email, $nickname) {
        $this->db->reconnect();
        $query = $this->db->query("SELECT * FROM users WHERE email=".$this->db->escape($email));
        $ranp = $this->_randPass();
        if ($query->num_rows())
            return array(
                'errno' => 1,
                'errmsg' => 'Email Exists'
            );
        $query = "INSERT INTO users (email, nickname, passhash) VALUES (".$this->db->escape($email).
            ",".$this->db->escape($nickname).",".$this->hashUserPass($email, $nickname).")";
        $this->db->query($query);
        return array(
            'errno' => 0,
            'ranpass' => $ranp
        );
    }

    public function login($email, $pass) {
        $this->db->reconnect();
        $query = $this->db->query("SELECT * FROM users WHERE email=".$this->db->escape($email));
        if ($query->num_rows()){
            if ($query->result()[0]->passhash == $this->encrypt->sha1($pass.$email)) {
                $this->db->query("DELETE FROM tokens WHERE uid=".$query->result()[0]->id);
                $token = $this->getToken($query->result()[0]->id);
                $this->db->query("INSERT INTO tokens (token, uid) VALUES ('"
                    .$token."',".$query->result()[0]->id.")");
                return array(
                    'errno' => 0,
                    'token' => $token,
                    'uid' => $query->result()[0]->id,
                    'nickname' => $query->result()[0]->nickname
                );
            }
            else {
                return array(
                    'errno' => 2,
                    'errmsg' => 'Wrong Password'
                );
            }
        }
        else {
            return array(
                'errno' => 1,
                'errmsg' => 'User Not Exists'
            );
        }
    }

    public function verify($token) {
        $this->db->reconnect();
        $query = $this->db->query("SELECT * FROM tokens WHERE token=".$this->db->escape($token));
        if ($query->num_rows()){
            $res = $this->db->query("SELECT * FROM users WHERE id=".$query->result()[0]->uid);
            if ($res->num_rows()){
                return array(
                    'uid' => $res->result()[0]->id,
                    'email' => $res->result()[0]->email,
                    'nickname' => $res->result()[0]->nickname,
                    'role' => $res->result()[0]->role
                );
            }
            else {
                return array(
                    'errno' => 1,
                    'errmsg' => 'Invalid Token'
                );
            }
        }
        else {
            return array(
                'errno' => 1,
                'errmsg' => 'Invaild Token'
            );
        }
    }
}
