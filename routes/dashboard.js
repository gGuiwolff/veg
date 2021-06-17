const router = require("express").Router();
const { requireLoggedInUser } = require("../middleware/auth");
const { feed } = require("../controllers/feed");

router.route("/images").post(requireLoggedInUser,feed)

//  ============== LISTAR AS FOTOS ============
/*outer.get("/listpictures", authorize, async (req, res) => {
  try {

    // get todo name and description for a specified user id
    const user = await pool.query(
      "SELECT ARRAY(SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.user_id = t.user_id WHERE u.user_id = $1)",
      //[INICIAL]  "SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.user_id = t.user_id WHERE u.user_id = $1",
      //"SELECT u.user_name, t.image_id, t.description FROM users AS u LEFT JOIN userimages AS t ON u.user_id = t.user_id WHERE u.user_id = $1",
      //[ARRAY]   "SELECT ARRAY(SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.user_id = t.user_id WHERE u.user_id = $1)",
      [req.user.id]
    );

    res.send(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});*/

// ===============  LINK DA FOTO ==============

// ========================== DANDO CERTO ====================================


/*router.post("/images",requireLoggedInUser, async (req, res) => {
  console.log('requisiçao feita')
  try {
    console.log('[REQ DASH]',req)
    const userId = req.session;
    //const  description  = req.body.description.url;
    const newImage = await db.query(
      "INSERT INTO userimages (id, description) VALUES ($1, $2) RETURNING *",
      [id, description]
    );
    res.json(newImage);
  } catch (err) {
    console.error(err.message);
  }
});*/

//>>>>> ============ ABRE TESTE URL PARA O USUARIO

// ===============  LINK DA FOTO ==============

// ======FUNCIONOU  =====
/*router.post("/images", authorize,async (req, res) => {
  console.log('requisiçao feita')
  try {
    console.log(req.body);
    const  description  = req.body.description.url;
    const newImage = await pool.query(
      "INSERT INTO userimages (user_id, description) VALUES ($1, $2) RETURNING *",
      [req.user.id, description]
    );

    res.json(newImage[0]);
  } catch (err) {
    console.error(err.message);
  }
  console.log(res)
});
*/
//=========== FUNCIONAOU ==========
module.exports = router;
