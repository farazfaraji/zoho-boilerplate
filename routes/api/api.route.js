

function load(router) {

    router.post('/api/test', async function (req, res, next) {
        try {
            res.send({status: true, code});
        } catch (e) {
            res.status(403).send({error: e.message});
        }
    });

}
module.exports = {
    load
};