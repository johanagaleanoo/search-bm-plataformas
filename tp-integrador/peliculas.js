document.addEventListener ("DOMContentLoaded", function (){
    const buscar_form= document.getElementById ("search");
    const buscar_input= document.getElementById ("input_search");
    const container= document.getElementById ("peliculas");
    const detalles_container= document.getElementById ("detalles_pelicula");
    const year_filtro= document.getElementById ("year_filtro");
    const tipo_filtro= document.getElementById ("tipo_filtro");
    const filtrar_boton= document.getElementById ("filtro");
    const eliminar_filtro_boton= document.getElementById ("reset_filtro");
    const container_filtro= document.getElementById ("filtrar");
    const spinner= document.getElementById ("spinner");
    let peliculas_todas= [];
    const api_key= "aa8be23"; 

    // mostrar el spinner
    function mostrar_spinner (){
        spinner.classList.remove ("d-none");
        spinner.classList.add ("d-flex");
    }

    // ocultar spinner 
    function ocultar_spinner (){
        spinner.classList.remove ("d-flex");
        spinner.classList.add ("d-none");
    }

    // buscar peliculas
    function buscar_peliculas (query){
        const url_api= `http://www.omdbapi.com/?s=${query}&apikey=${api_key}`;

        mostrar_spinner ();

        fetch (url_api)
        .then (response => response.json ())
        .then (data => {
            if (data.Response === "True"){
                peliculas_todas= data.Search;
                mostrar_peliculas (peliculas_todas);
                detalles_container.innerHTML= "";
                // mostrar filtro
                container_filtro.style.display= "block";
                
            }
            else {
                container.innerHTML= `<p class="no_encontrado_movie"> no se encontro la pelicula </p>`;
                detalles_container.innerHTML= "";

                // ocultar filtro
                container_filtro.style.display= "none";
                
                ocultar_spinner ();
            }
        })
        .catch (error => {
            console.log ("error: ", error);
            // alert ("error al buscar la pelicula");

            ocultar_spinner ();
        })
        .finally (() => {
            ocultar_spinner ();
        });
    }

    // mostrar peliculas
    function mostrar_peliculas (peliculas){
        container.innerHTML= "";

        peliculas.forEach(movie => {
            const card= `
                <div class="col-12 col-md-4 col-lg-3">
                    <div class="card">
                        <img src="${ movie.Poster }" class="card-img-top" alt="${ movie.Title }">
                        <a href="informacion_peliculas.html?id=${movie.imdbID}" id="informacion_peliculas">
                            <div class="card-body">
                                <h3 class="card-title">
                                    ${ movie.Title }
                                </h3>
                                <p class="card-text">
                                   Año: ${ movie.Year }
                                </p>  
                            </div>
                        </a>
                        <button class="btn btn-outline-success btn_agregar_favoritos" data-id="${movie.imdbID}">
                            ✰
                        </button>
                    </div> 
                </div>
            `;

            container.innerHTML += card;
        });

        container_filtro.style.display= "block";
    }

    // detalles de una pelicula
    function pelicula_detalles (){
        const params= new URLSearchParams (window.location.search);
        const movie_id= params.get ("id");
        const url_api= `https://www.omdbapi.com/?i=${movie_id}&apikey=${api_key}`;

        fetch (url_api)
            .then (response => response.json ())
            .then (data => {
                if (data.Response === "True"){
                    mostrar_detalles (data);
                }
                else {
                    detalles_container.innerHTML= `<p class="no_encontrado_movie"> no se encontro la pelicula </p>`;
                }
            })
            .catch (error => {
                console.log ("error: ", error);
                // alert ("error al buscar el ID la pelicula");
            });
    }

    // card con los detalles
    function mostrar_detalles (pelicula){
        const detalles= `
            <div class="d-flex justify-content-center">
                <div class="card mb-3" style="max-width: 540px">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${ pelicula.Poster }" class="card-img-top" alt="${ pelicula.Title }">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">
                                    ${ pelicula.Title }
                                </h5>
                                <p class="card-text">
                                    Año: ${ pelicula.Year }
                                </p>
                                <p class="card-text">
                                    Descripción: ${ pelicula.Plot }
                                </p>
                                <p class="card-text">
                                    Genero: ${ pelicula.Genre }
                                </p>
                                <p class="card-text">
                                    Director: ${ pelicula.Director }
                                </p>
                                <p class="card-text">
                                    Actores: ${ pelicula.Actors }
                                </p>
                                <p class="card-text">
                                    Premios: ${ pelicula.Awards }
                                </p>
                                <p class="card-text">
                                    Produccion: ${ pelicula.Production }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        detalles_container.innerHTML= detalles;
    }

    // filtrar peliculas
    function filtrar_peliculas (){
        const year= year_filtro.value.trim ();
        const tipo= tipo_filtro.value;

        const peliculas_filtrada= peliculas_todas.filter (movie => {
            const comprobar_year= year ? movie.Year === year : true; 
            const comprobar_tipo= tipo ? movie.Type === tipo : true;

            return comprobar_year && comprobar_tipo;
        });

        mostrar_peliculas (peliculas_filtrada);
    }

    // formulario de busqueda
    buscar_form?.addEventListener ("submit", function (e){
        // prevenir el envio del formulario
        e.preventDefault ();

        const query= buscar_input.value.trim ();

        if (query){
            buscar_peliculas (query);
        }
    });

    // filtrar pelicula
    filtrar_boton?.addEventListener ("click", filtrar_peliculas);

    // sacar filtro
    eliminar_filtro_boton?.addEventListener ("click", function (){
        year_filtro.value= "";
        tipo_filtro.value= "";

        mostrar_peliculas (peliculas_todas);
    });

    if (window.location.pathname.includes ("informacion_peliculas.html")){
        pelicula_detalles ();
    }
});