const { Schema, model } = require("mongoose");

const articleSchema = Schema({
    title: String,
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

let Article;

module.exports = Article = model("Article", articleSchema);

async function test() {
    const articles = await Article.find().populate({
        path: "user",
        select: "-password",
        match: {
            name: /aa/i,
        }
    });

    if (articles) {
        console.log(articles.filter((article) => article.user));
    } else {
        console.log("Aucun article trouvé.");
    }


    /* new Article({
      title: "test",
      content: "contenu",
      user: "6637cf7f70f137f0b7cc3650",
    }).save(); */
}

test();
