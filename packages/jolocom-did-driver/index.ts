import express from "express"
import { getResolver } from "@jolocom/jolo-did-resolver";
import { Resolver } from "did-resolver";

const PORT = 8080;

const app = express();
app.get('/1.0/identifiers/:did', async (req, res) => {
  const did = req.params.did;
  console.log(did);

  const resolver = new Resolver(getResolver());
  const didDocument = await resolver.resolve(did);
  if (didDocument)
    res.send(didDocument);
  else
    res.sendStatus(404)
});

app.listen(PORT, function () {
  console.log(`Jolocom Resolver driver active on port ${ PORT }...`)
});
