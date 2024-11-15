document.getElementById ("search").addEventListener ("submit", function (e){
    // prevenir el envio del formulario
    e.preventDefault ();

    const query= document.getElementById ("input_search").value.trim ();
    const container_libros= document.getElementById ("libros");

    if (query){
        document.getElementById ("spinner").classList.remove ("d-none"); 
        document.getElementById ("spinner").classList.add ("d-flex");

        container_libros.innerHTML= ""; 

        fetch (`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`)
            .then (response => response.json ())
            .then (data => {
                container_libros.innerHTML= "";

                if (data.docs && data.docs.length > 0){
                    data.docs.forEach (book => {
                        const card= card_libro (book);

                        container_libros.appendChild (card);
                    });
                } 
                else {
                    container_libros.innerHTML= '<p> no se encontraron libros </p>';
                }

                document.getElementById ("spinner").classList.remove ("d-flex"); 
                document.getElementById ("spinner").classList.add ("d-none");
            })
            .catch (error => {
                console.error (error);
                
                document.getElementById ("spinner").classList.remove ("d-flex"); 
                document.getElementById ("spinner").classList.add ("d-none");

                container_libros.innerHTML= '<p> hubo un error al realizar al buscar </p>';
            });
    }

    function card_libro (book){
        const card= document.createElement ("div");
        const link= document.createElement ("a");
    
        card.className= "col m-3";
        link.href= `informacion_libros.html?bookKey=${book.key}`;
        link.className= "card-link";
    
        card.innerHTML= `
            <div class="card">
                <img src="${ book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/128x180?text=No+Image' }" class="card-img-top" alt="${ book.title }">
                <div class="card-body">
                    <h5 class="card-title">
                        ${ book.title }
                    </h5>
                    <p class="card-text">
                        ${ book.first_publish_year ? book.first_publish_year : 'año no disponible' }
                    </p>
                </div>
            </div>
        `;
    
        link.appendChild (card);
    
        return link;
    }
});
