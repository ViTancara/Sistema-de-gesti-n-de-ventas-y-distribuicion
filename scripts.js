/* --- DATOS DE PRUEBA --- */

        const inventario = [
            { producto: "Aceite 5W-30", cantidad: 50 },
            { producto: "Grasa Multiuso", cantidad: 30 },
            { producto: "Aceite 10W-40", cantidad: 20 }
        ];

        const vehiculos = [
            { nombre: "Camión 1", productos: [] },
            { nombre: "Camión 2", productos: [] }
        ];

        const incidencias = [];

        /* CAMBIO DE SECCIONES */
        function showSection(id) {
            document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
            document.getElementById(id).classList.add("active");

            if (id === "inventario") mostrarInventario();
            if (id === "despacho") prepararDespacho();
            if (id === "recepcion") prepararRecepcion();
            if (id === "reportes") mostrarReportes();
        }

        /* INVENTARIO */
        function mostrarInventario() {
            const tbody = document.querySelector("#tablaInventario tbody");
            tbody.innerHTML = "";
            inventario.forEach(item => {
                tbody.innerHTML += `<tr><td>${item.producto}</td><td>${item.cantidad}</td></tr>`;
            });
        }

        /* DESPACHO */
        function prepararDespacho() {
            document.getElementById("alertaDespacho").innerHTML = "";

            const select = document.getElementById("vehiculoSelect");
            select.innerHTML = vehiculos.map((v, i) => `<option value="${i}">${v.nombre}</option>`).join("");

            const tbody = document.querySelector("#tablaDespacho tbody");
            tbody.innerHTML = "";
            inventario.forEach((item, index) => {
                tbody.innerHTML += `
        <tr>
            <td>${item.producto}</td>
            <td>${item.cantidad}</td>
            <td><input type="number" id="cant${index}" min="0" max="${item.cantidad}" value="0"></td>
        </tr>`;
            });
        }

        function registrarDespacho() {
            const veh = vehiculos[document.getElementById("vehiculoSelect").value];
            let error = false;

            inventario.forEach((item, index) => {
                const cant = parseInt(document.getElementById(`cant${index}`).value) || 0;

                if (cant > item.cantidad) error = true;
                else if (cant > 0) {
                    item.cantidad -= cant;
                    const existente = veh.productos.find(p => p.producto === item.producto);
                    if (existente) existente.cantidad += cant;
                    else veh.productos.push({ producto: item.producto, cantidad: cant });
                }
            });

            let alerta = document.getElementById("alertaDespacho");
            if (error) {
                alerta.className = "alert alert-error";
                alerta.textContent = "Error: La cantidad supera el stock.";
            } else {
                alerta.className = "alert alert-success";
                alerta.textContent = "Despacho registrado correctamente.";
                mostrarInventario();
                prepararDespacho();
            }
        }

        /* RECEPCIÓN */
        function prepararRecepcion() {
            document.getElementById("alertaRecepcion").innerHTML = "";

            const select = document.getElementById("vehiculoRecepcion");
            select.innerHTML = vehiculos.map((v, i) => `<option value="${i}">${v.nombre}</option>`).join("");

            document.querySelector("#tablaRecepcion tbody").innerHTML = "";
        }

        function mostrarProductosVehiculo() {
            const veh = vehiculos[document.getElementById("vehiculoRecepcion").value];
            const tbody = document.querySelector("#tablaRecepcion tbody");
            tbody.innerHTML = "";

            veh.productos.forEach((p, index) => {
                tbody.innerHTML += `
        <tr>
            <td>${p.producto}</td>
            <td>${p.cantidad}</td>
            <td><input type="number" id="recib${index}" value="${p.cantidad}" min="0"></td>
        </tr>`;
            });
        }

        function confirmarRecepcion() {
            const veh = vehiculos[document.getElementById("vehiculoRecepcion").value];

            veh.productos.forEach((p, index) => {
                const recibido = parseInt(document.getElementById(`recib${index}`).value);
                if (recibido !== p.cantidad) {
                    incidencias.push({
                        vehiculo: veh.nombre,
                        producto: p.producto,
                        diferencia: p.cantidad - recibido
                    });
                }
                p.cantidad = recibido;
            });

            let alerta = document.getElementById("alertaRecepcion");
            alerta.className = "alert alert-success";
            alerta.textContent = "Recepción confirmada.";
        }

        /* REPORTES */
        function mostrarReportes() {
            const tbody = document.querySelector("#tablaReportes tbody");
            tbody.innerHTML = incidencias.map(i =>
                `<tr><td>${i.vehiculo}</td><td>${i.producto}</td><td>${i.diferencia}</td></tr>`
            ).join("");
        }

        /* INICIALIZAR */
        mostrarInventario();


        // Datos de ejemplo de roles
        let roles = [
            { nombre: "Administrador", descripcion: "Acceso total al sistema", estado: "Activo" },
            { nombre: "Supervisor", descripcion: "Puede aprobar solicitudes y ver reportes", estado: "Activo" }
        ];

        // Función para mostrar el formulario
        function mostrarFormularioRol() {
            document.getElementById("formRol").style.display = "block";
        }

        // Cancelar formulario
        function cancelarFormularioRol() {
            document.getElementById("formRol").style.display = "none";
            document.getElementById("nombreRol").value = "";
            document.getElementById("descRol").value = "";
        }

        // Agregar nuevo rol
        function agregarRol() {
            const nombre = document.getElementById("nombreRol").value.trim();
            const desc = document.getElementById("descRol").value.trim();
            const estado = document.getElementById("estadoRol").value;

            if (nombre === "" || desc === "") {
                alert("Debe completar todos los campos");
                return;
            }

            roles.push({ nombre, descripcion: desc, estado });
            document.getElementById("formRol").style.display = "none";
            document.getElementById("nombreRol").value = "";
            document.getElementById("descRol").value = "";

            mostrarRoles();
        }

        // Mostrar roles en la tabla
        function mostrarRoles() {
            const tbody = document.getElementById("tablaRoles");
            tbody.innerHTML = "";

            roles.forEach((rol, index) => {
                tbody.innerHTML += `
            <tr>
                <td>${rol.nombre}</td>
                <td>${rol.descripcion}</td>
                <td>${rol.estado}</td>
                <td>
                    <button onclick="editarRol(${index})" style="background:#f39c12; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Editar</button>
                    <button onclick="eliminarRol(${index})" style="background:#e74c3c; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        // Editar rol
        function editarRol(index) {
            const rol = roles[index];
            document.getElementById("nombreRol").value = rol.nombre;
            document.getElementById("descRol").value = rol.descripcion;
            document.getElementById("estadoRol").value = rol.estado;
            document.getElementById("formRol").style.display = "block";

            // Cambiamos el botón para actualizar en lugar de agregar
            const btnGuardar = document.querySelector("#formRol .btn");
            btnGuardar.textContent = "Actualizar Rol";
            btnGuardar.onclick = function () {
                roles[index].nombre = document.getElementById("nombreRol").value;
                roles[index].descripcion = document.getElementById("descRol").value;
                roles[index].estado = document.getElementById("estadoRol").value;
                mostrarRoles();
                cancelarFormularioRol();
                btnGuardar.textContent = "Guardar Rol";
                btnGuardar.onclick = agregarRol;
            };
        }

        // Eliminar rol
        function eliminarRol(index) {
            if (confirm("¿Desea eliminar este rol?")) {
                roles.splice(index, 1);
                mostrarRoles();
            }
        }

        // Inicializar tabla
        mostrarRoles();



        /// Lista de todos los permisos disponibles
        const permisosDisponibles = [
            "Acceso al Inventario",
            "Crear Solicitud de Ingreso",
            "Aprobar Solicitud de Ingreso",
            "Generar Orden de Salida",
            "Confirmar Recepción de Productos",
            "Gestionar Clientes",
            "Gestionar Proveedores",
            "Generar Reportes",
            "Configurar Sistema",
            "Ajustes de Usuario"
        ];

        // Objeto para almacenar qué permisos tiene cada rol
        let permisosPorRol = {};

        // Inicializar roles y permisos por rol
        function inicializarPermisos() {
            roles.forEach(r => {
                if (!permisosPorRol[r.nombre]) {
                    permisosPorRol[r.nombre] = {}; // inicializa permisos como false
                    permisosDisponibles.forEach(p => permisosPorRol[r.nombre][p] = false);
                }
            });

            // Llenar select de roles
            const select = document.getElementById("selectRol");
            select.innerHTML = roles.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join("");

            cargarPermisosRol();
        }

        // Cargar los permisos del rol seleccionado en la tabla
        function cargarPermisosRol() {
            const rolSeleccionado = document.getElementById("selectRol").value;
            const tbody = document.getElementById("tablaPermisosRol");
            tbody.innerHTML = "";

            permisosDisponibles.forEach(permiso => {
                const checked = permisosPorRol[rolSeleccionado][permiso] ? "checked" : "";
                tbody.innerHTML += `
            <tr>
                <td>${permiso}</td>
                <td><input type="checkbox" onchange="togglePermiso('${rolSeleccionado}','${permiso}',this.checked)" ${checked}></td>
                <td><input type="checkbox" onchange="togglePermiso('${rolSeleccionado}','${permiso}',this.checked)" ${checked}></td>
                <td><input type="checkbox" onchange="togglePermiso('${rolSeleccionado}','${permiso}',this.checked)" ${checked}></td>
                <td><input type="checkbox" onchange="togglePermiso('${rolSeleccionado}','${permiso}',this.checked)" ${checked}></td>
                <td><input type="checkbox" onchange="togglePermiso('${rolSeleccionado}','${permiso}',this.checked)" ${checked}></td>
            </tr>
        `;
            });
        }

        // Actualizar permiso al hacer check/uncheck
        function togglePermiso(rol, permiso, estado) {
            permisosPorRol[rol][permiso] = estado;
        }

        // Guardar cambios (puede enviar a backend o solo alert por ahora)
        function guardarPermisos() {
            const rolSeleccionado = document.getElementById("selectRol").value;
            alert(`Permisos actualizados para ${rolSeleccionado}:\n` +
                Object.entries(permisosPorRol[rolSeleccionado])
                    .filter(([perm, val]) => val)
                    .map(([perm]) => perm)
                    .join(", ")
            );
        }

        // Inicializar al cargar
        inicializarPermisos();

        let usuarios = [];

        // Mostrar formulario
        function mostrarFormularioUsuario() {
            // Cargar roles disponibles en el select
            const selectRol = document.getElementById("rolUsuario");
            selectRol.innerHTML = roles.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join("");

            document.getElementById("formUsuario").style.display = "block";
        }

        // Ocultar formulario
        function cancelarFormularioUsuario() {
            document.getElementById("formUsuario").style.display = "none";
        }

        // Agregar usuario
        function agregarUsuario() {
            const nombre = document.getElementById("nombreUsuario").value;
            const correo = document.getElementById("correoUsuario").value;
            const login = document.getElementById("loginUsuario").value;
            const rol = document.getElementById("rolUsuario").value;
            const estado = document.getElementById("estadoUsuario").value;

            if (!nombre || !correo || !login) {
                alert("Todos los campos son obligatorios");
                return;
            }

            usuarios.push({ nombre, correo, login, rol, estado });

            actualizarTablaUsuarios();
            cancelarFormularioUsuario();
        }

        // Actualizar tabla
        function actualizarTablaUsuarios() {
            const tbody = document.getElementById("tablaUsuarios");
            tbody.innerHTML = "";

            usuarios.forEach((u, index) => {
                tbody.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.login}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>
                    <button class="btn" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn" style="background:#e74c3c;" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        // Eliminar usuario
        function eliminarUsuario(i) {
            if (confirm("¿Eliminar este usuario?")) {
                usuarios.splice(i, 1);
                actualizarTablaUsuarios();
            }
        }

        // Editar usuario (simple demo)
        function editarUsuario(i) {
            const u = usuarios[i];
            alert("Aquí se podría abrir un formulario para editar.\nEjemplo:\n" + JSON.stringify(u, null, 2));
        }

        //CLIENTES----------------------------------------------------------------------------------------------------------
        let clientes = [
            {
                tipo: "Persona",
                nombre: "Juan Carlos Mamani Quispe",
                cednit: "7896541",
                pv: "Minimarket San Pedro",
                ci: "7896541",
                correo: "juan.mamani@gmail.com",
                cel: "69912345",
                tel: "2245789",
                dir: "Calle 12, Zona Obrajes",
                gps: "-16.5150, -68.1234",
                ciudad: "La Paz",
                contacto: "Carlos Mamani",
                telContacto: "69988774",
                obs: "Cliente frecuente."
            },
            {
                tipo: "Empresa",
                nombre: "Distribuidora Andina SRL",
                cednit: "102345678",
                pv: "Punto de Venta Central",
                ci: "",
                correo: "ventas@andina.com",
                cel: "72045678",
                tel: "2213456",
                dir: "Av. Montes 123",
                gps: "-16.4953, -68.1330",
                ciudad: "El Alto",
                contacto: "María López",
                telContacto: "71599887",
                obs: "Entrega semanal."
            }
        ];

        let editIndex = null;

        /* ABRIR MODAL */
        function abrirModalCliente() {
            editIndex = null;
            document.getElementById("modalCliente").style.display = "block";
            document.getElementById("btnGuardarCliente").textContent = "Guardar";
            document.querySelectorAll("#modalCliente input").forEach(i => i.value = "");
        }

        /* CERRAR MODAL */
        function cerrarModalCliente() {
            document.getElementById("modalCliente").style.display = "none";
        }

        /* GUARDAR O ACTUALIZAR */
        function guardarCliente() {
            const cliente = {
                tipo: tipoCliente.value,
                nombre: nombreCliente.value,
                cednit: cedulaNit.value,
                pv: puntoVenta.value,
                ci: ciCliente.value,
                correo: emailCliente.value,
                cel: celCliente.value,
                tel: telCliente.value,
                dir: dirCliente.value,
                gps: gpsCliente.value,
                ciudad: ciudadCliente.value,
                contacto: contactoCliente.value,
                telContacto: telContactoCliente.value,
                obs: obsCliente.value
            };

            if (cliente.nombre === "" || cliente.cednit === "") {
                alert("Complete los campos obligatorios");
                return;
            }

            if (editIndex === null) {
                clientes.push(cliente);
            } else {
                clientes[editIndex] = cliente;
            }

            cerrarModalCliente();
            mostrarClientes();
        }

        /* LLENAR TABLA */
        function mostrarClientes() {
            const tbody = document.getElementById("tablaClientes");
            tbody.innerHTML = "";

            clientes.forEach((c, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${c.tipo}</td>
                <td>${c.nombre}</td>
                <td>${c.cednit}</td>
                <td>${c.pv}</td>
                <td>${c.ciudad}</td>
                <td>${c.contacto}</td>
                <td>
                    <button onclick="editarCliente(${i})" 
                        style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">
                        Editar
                    </button>
                    <button onclick="eliminarCliente(${i})"
                        style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">
                        Eliminar
                    </button>
                    <button onclick="verDetallesCliente(${i})"
                        style="background:#3498db;color:white;border:none;padding:5px 8px;border-radius:4px;">
                        Ver detalles
                    </button>
                </td>
            </tr>
        `;
            });
        }


        /* EDITAR */
        function editarCliente(i) {
            const c = clientes[i];
            editIndex = i;

            tipoCliente.value = c.tipo;
            nombreCliente.value = c.nombre;
            cedulaNit.value = c.cednit;
            puntoVenta.value = c.pv;
            ciCliente.value = c.ci;
            emailCliente.value = c.correo;
            celCliente.value = c.cel;
            telCliente.value = c.tel;
            dirCliente.value = c.dir;
            gpsCliente.value = c.gps;
            ciudadCliente.value = c.ciudad;
            contactoCliente.value = c.contacto;
            telContactoCliente.value = c.telContacto;
            obsCliente.value = c.obs;

            document.getElementById("btnGuardarCliente").textContent = "Actualizar";
            abrirModalCliente();
        }

        /* ELIMINAR */
        function eliminarCliente(i) {
            if (confirm("¿Eliminar cliente?")) {
                clientes.splice(i, 1);
                mostrarClientes();
            }
        }
        function verDetallesCliente(i) {
            const c = clientes[i];
            const contenido = document.getElementById("contenidoDetalles");

            contenido.innerHTML = `
        <p><strong>Tipo:</strong> ${c.tipo}</p>
        <p><strong>Nombre / Razón Social:</strong> ${c.nombre}</p>
        <p><strong>Cédula / NIT:</strong> ${c.cednit}</p>
        <p><strong>Nombre Punto de Venta:</strong> ${c.pv}</p>
        <p><strong>CI:</strong> ${c.ci}</p>
        <p><strong>Correo:</strong> ${c.correo}</p>
        <p><strong>Celular:</strong> ${c.cel}</p>
        <p><strong>Teléfono:</strong> ${c.tel}</p>
        <p><strong>Dirección:</strong> ${c.dir}</p>
        <p><strong>Ciudad:</strong> ${c.ciudad}</p>
        <p><strong>Contacto:</strong> ${c.contacto}</p>
        <p><strong>Teléfono de Contacto:</strong> ${c.telContacto}</p>
        <p><strong>Observaciones:</strong> ${c.obs}</p>
    `;

            document.getElementById("modalDetalles").style.display = "block";

            // Inicializar mapa con Leaflet
            const coords = c.gps.split(","); // "-16.5150, -68.1234"
            const lat = parseFloat(coords[0].trim());
            const lng = parseFloat(coords[1].trim());

            // Limpiar mapa anterior si existe
            if (window.mapa) {
                window.mapa.remove();
            }

            window.mapa = L.map('mapaCliente').setView([lat, lng], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(window.mapa);

            L.marker([lat, lng]).addTo(window.mapa)
                .bindPopup(`${c.nombre} <br> ${c.dir}`)
                .openPopup();
        }

        function cerrarModalDetalles() {
            document.getElementById("modalDetalles").style.display = "none";
        }


        mostrarClientes();

        //--------------------------------------------------------------------------PROVEEDORES
        // Datos de ejemplo de proveedores
        let proveedores = [
            {
                nombre: "Proveedor Uno",
                categorias: ["Grasas", "Aceites"],
                marcas: ["Marca A", "Marca B"],
                contactos: [
                    { nombre: "Carlos Pérez", telefono: "78965412" },
                    { nombre: "Ana Gómez", telefono: "72145698" }
                ]
            },
            {
                nombre: "Proveedor Dos",
                categorias: ["Electrónica"],
                marcas: ["Marca C"],
                contactos: [
                    { nombre: "Luis Martínez", telefono: "78451236" }
                ]
            }
        ];

        let editProveedorIndex = null;

        function abrirModalProveedor() {
            editProveedorIndex = null;
            document.getElementById("modalProveedor").style.display = "block";
            document.getElementById("btnGuardarProveedor").textContent = "Guardar";
            document.getElementById("nombreProveedor").value = "";
            document.getElementById("categoriasProveedor").selectedIndex = -1;
            document.getElementById("marcasProveedor").selectedIndex = -1;
            document.getElementById("contactosProveedor").innerHTML = `<div><input type="text" placeholder="Nombre Contacto"><input type="text" placeholder="Teléfono Contacto"></div>`;
        }

        function cerrarModalProveedor() {
            document.getElementById("modalProveedor").style.display = "none";
        }

        function agregarCampoContacto() {
            const div = document.createElement("div");
            div.innerHTML = `<input type="text" placeholder="Nombre Contacto"> <input type="text" placeholder="Teléfono Contacto">`;
            document.getElementById("contactosProveedor").appendChild(div);
        }

        function guardarProveedor() {
            const nombre = document.getElementById("nombreProveedor").value;
            const categorias = Array.from(document.getElementById("categoriasProveedor").selectedOptions).map(o => o.value);
            const marcas = Array.from(document.getElementById("marcasProveedor").selectedOptions).map(o => o.value);

            const contactosDivs = document.querySelectorAll("#contactosProveedor div");
            const contactos = [];
            contactosDivs.forEach(d => {
                const inputs = d.querySelectorAll("input");
                if (inputs[0].value && inputs[1].value) {
                    contactos.push({ nombre: inputs[0].value, telefono: inputs[1].value });
                }
            });

            const proveedor = { nombre, categorias, marcas, contactos };

            if (editProveedorIndex === null) {
                proveedores.push(proveedor);
            } else {
                proveedores[editProveedorIndex] = proveedor;
            }

            cerrarModalProveedor();
            mostrarProveedores();
        }

        function mostrarProveedores() {
            const tbody = document.getElementById("tablaProveedores");
            tbody.innerHTML = "";

            proveedores.forEach((p, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.categorias.join(", ")}</td>
                <td>${p.marcas.join(", ")}</td>
                <td>
                    <button onclick="editarProveedor(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarProveedor(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                    <button onclick="verDetallesProveedor(${i})" style="background:#3498db;color:white;border:none;padding:5px 8px;border-radius:4px;">Ver detalles</button>
                </td>
            </tr>
        `;
            });
        }

        function editarProveedor(i) {
            const p = proveedores[i];
            editProveedorIndex = i;

            document.getElementById("nombreProveedor").value = p.nombre;
            Array.from(document.getElementById("categoriasProveedor").options).forEach(opt => opt.selected = p.categorias.includes(opt.value));
            Array.from(document.getElementById("marcasProveedor").options).forEach(opt => opt.selected = p.marcas.includes(opt.value));

            const contactosDiv = document.getElementById("contactosProveedor");
            contactosDiv.innerHTML = "";
            p.contactos.forEach(c => {
                const div = document.createElement("div");
                div.innerHTML = `<input type="text" placeholder="Nombre Contacto" value="${c.nombre}"> <input type="text" placeholder="Teléfono Contacto" value="${c.telefono}">`;
                contactosDiv.appendChild(div);
            });

            document.getElementById("btnGuardarProveedor").textContent = "Actualizar";
            abrirModalProveedor();
        }

        function eliminarProveedor(i) {
            if (confirm("¿Eliminar proveedor?")) {
                proveedores.splice(i, 1);
                mostrarProveedores();
            }
        }

        function verDetallesProveedor(i) {
            const p = proveedores[i];
            const div = document.getElementById("contenidoDetallesProveedor");

            div.innerHTML = `
        <p><strong>Nombre:</strong> ${p.nombre}</p>
        <p><strong>Categorías:</strong> ${p.categorias.join(", ")}</p>
        <p><strong>Marcas:</strong> ${p.marcas.join(", ")}</p>
        <p><strong>Contactos:</strong></p>
        <ul>
            ${p.contactos.map(c => `<li>${c.nombre} - ${c.telefono}</li>`).join("")}
        </ul>
    `;

            document.getElementById("modalDetallesProveedor").style.display = "block";
        }

        function cerrarModalDetallesProveedor() {
            document.getElementById("modalDetallesProveedor").style.display = "none";
        }

        // Inicializar tabla con ejemplos
        mostrarProveedores();

        //----------------------------------------------------------------------CATEGORIAS
        // Datos de ejemplo de categorías
        let categorias = [
            { nombre: "Grasas", descripcion: "Productos comestibles", estado: "Activo" },
            { nombre: "Aceites", descripcion: "Líquidos para consumo", estado: "Activo" }
        ];

        let editCategoriaIndex = null;

        function abrirModalCategoria() {
            editCategoriaIndex = null;
            document.getElementById("modalCategoria").style.display = "block";
            document.getElementById("btnGuardarCategoria").textContent = "Guardar";
            document.getElementById("nombreCategoria").value = "";
            document.getElementById("descCategoria").value = "";
            document.getElementById("estadoCategoria").value = "Activo";
        }

        function cerrarModalCategoria() {
            document.getElementById("modalCategoria").style.display = "none";
        }

        function guardarCategoria() {
            const nombre = document.getElementById("nombreCategoria").value.trim();
            const descripcion = document.getElementById("descCategoria").value.trim();
            const estado = document.getElementById("estadoCategoria").value;

            if (nombre === "") {
                alert("El nombre de la categoría es obligatorio");
                return;
            }

            const categoria = { nombre, descripcion, estado };

            if (editCategoriaIndex === null) {
                categorias.push(categoria);
            } else {
                categorias[editCategoriaIndex] = categoria;
            }

            cerrarModalCategoria();
            mostrarCategorias();
        }

        function mostrarCategorias() {
            const tbody = document.getElementById("tablaCategorias");
            tbody.innerHTML = "";

            categorias.forEach((c, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.descripcion}</td>
                <td>${c.estado}</td>
                <td>
                    <button onclick="editarCategoria(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarCategoria(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        function editarCategoria(i) {
            const c = categorias[i];
            editCategoriaIndex = i;

            document.getElementById("nombreCategoria").value = c.nombre;
            document.getElementById("descCategoria").value = c.descripcion;
            document.getElementById("estadoCategoria").value = c.estado;

            document.getElementById("btnGuardarCategoria").textContent = "Actualizar";
            abrirModalCategoria();
        }

        function eliminarCategoria(i) {
            if (confirm("¿Eliminar esta categoría?")) {
                categorias.splice(i, 1);
                mostrarCategorias();
            }
        }

        // Inicializar tabla con ejemplos
        mostrarCategorias();

        //----------------------------------------------------------------------MARCAS
        // Datos de ejemplo de marcas
        let marcas = [
            { nombre: "Marca A", descripcion: "Marca de alimentos", estado: "Activo" },
            { nombre: "Marca B", descripcion: "Marca de bebidas", estado: "Activo" }
        ];

        let editMarcaIndex = null;

        function abrirModalMarca() {
            editMarcaIndex = null;
            document.getElementById("modalMarca").style.display = "block";
            document.getElementById("btnGuardarMarca").textContent = "Guardar";
            document.getElementById("nombreMarca").value = "";
            document.getElementById("descMarca").value = "";
            document.getElementById("estadoMarca").value = "Activo";
        }

        function cerrarModalMarca() {
            document.getElementById("modalMarca").style.display = "none";
        }

        function guardarMarca() {
            const nombre = document.getElementById("nombreMarca").value.trim();
            const descripcion = document.getElementById("descMarca").value.trim();
            const estado = document.getElementById("estadoMarca").value;

            if (nombre === "") {
                alert("El nombre de la marca es obligatorio");
                return;
            }

            const marca = { nombre, descripcion, estado };

            if (editMarcaIndex === null) {
                marcas.push(marca);
            } else {
                marcas[editMarcaIndex] = marca;
            }

            cerrarModalMarca();
            mostrarMarcas();
        }

        function mostrarMarcas() {
            const tbody = document.getElementById("tablaMarcas");
            tbody.innerHTML = "";

            marcas.forEach((m, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${m.nombre}</td>
                <td>${m.descripcion}</td>
                <td>${m.estado}</td>
                <td>
                    <button onclick="editarMarca(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarMarca(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        function editarMarca(i) {
            const m = marcas[i];
            editMarcaIndex = i;

            document.getElementById("nombreMarca").value = m.nombre;
            document.getElementById("descMarca").value = m.descripcion;
            document.getElementById("estadoMarca").value = m.estado;

            document.getElementById("btnGuardarMarca").textContent = "Actualizar";
            abrirModalMarca();
        }

        function eliminarMarca(i) {
            if (confirm("¿Eliminar esta marca?")) {
                marcas.splice(i, 1);
                mostrarMarcas();
            }
        }

        // Inicializar tabla con ejemplos
        mostrarMarcas();

        //-----------------------------------------------------------------------------PRODUCTOS
        let productos = [
            { nombre: "Producto 1", categoria: "Aceites", marca: "Marca A", precio: 10.5, stock: 100, descripcion: "Producto comestible" },
            { nombre: "Producto 2", categoria: "Grasas", marca: "Marca B", precio: 5.75, stock: 50, descripcion: "Bebida refrescante" }
        ];

        let editProductoIndex = null;

        function actualizarSelectProductos() {
            const catSelect = document.getElementById("categoriaProducto");
            const marcaSelect = document.getElementById("marcaProducto");

            // Limpiar opciones
            catSelect.innerHTML = "";
            marcasSelect = marcaSelect;
            marcaSelect.innerHTML = "";

            // Agregar categorías
            categorias.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.nombre;
                opt.textContent = c.nombre;
                catSelect.appendChild(opt);
            });

            // Agregar marcas
            marcas.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.nombre;
                opt.textContent = m.nombre;
                marcaSelect.appendChild(opt);
            });
        }

        function abrirModalProducto() {
            editProductoIndex = null;
            actualizarSelectProductos();
            document.getElementById("modalProducto").style.display = "block";
            document.getElementById("btnGuardarProducto").textContent = "Guardar";

            document.getElementById("nombreProducto").value = "";
            document.getElementById("precioProducto").value = "";
            document.getElementById("stockProducto").value = "";
            document.getElementById("descProducto").value = "";
        }

        function cerrarModalProducto() {
            document.getElementById("modalProducto").style.display = "none";
        }

        function guardarProducto() {
            const nombre = document.getElementById("nombreProducto").value.trim();
            const categoria = document.getElementById("categoriaProducto").value;
            const marca = document.getElementById("marcaProducto").value;
            const precio = parseFloat(document.getElementById("precioProducto").value);
            const stock = parseInt(document.getElementById("stockProducto").value);
            const descripcion = document.getElementById("descProducto").value.trim();

            if (!nombre || !categoria || !marca || isNaN(precio) || isNaN(stock)) {
                alert("Debe completar todos los campos obligatorios");
                return;
            }

            const producto = { nombre, categoria, marca, precio, stock, descripcion };

            if (editProductoIndex === null) {
                productos.push(producto);
            } else {
                productos[editProductoIndex] = producto;
            }

            cerrarModalProducto();
            mostrarProductos();
        }

        function mostrarProductos() {
            const tbody = document.getElementById("tablaProductos");
            tbody.innerHTML = "";

            productos.forEach((p, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.marca}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarProducto(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        function editarProducto(i) {
            const p = productos[i];
            editProductoIndex = i;
            actualizarSelectProductos();

            document.getElementById("nombreProducto").value = p.nombre;
            document.getElementById("categoriaProducto").value = p.categoria;
            document.getElementById("marcaProducto").value = p.marca;
            document.getElementById("precioProducto").value = p.precio;
            document.getElementById("stockProducto").value = p.stock;
            document.getElementById("descProducto").value = p.descripcion;

            document.getElementById("btnGuardarProducto").textContent = "Actualizar";
            abrirModalProducto();
        }

        function eliminarProducto(i) {
            if (confirm("¿Eliminar este producto?")) {
                productos.splice(i, 1);
                mostrarProductos();
            }
        }

        // Inicializar tabla con ejemplos
        mostrarProductos();

        //--------------------------------------------------------------------------------ALMACEN CENTRAL
        let almacen = []; // Contendrá objetos {producto: nombre, categoria, marca, stock}

        // Inicializamos el almacen con el stock de productos existentes
        productos.forEach(p => {
            almacen.push({
                producto: p.nombre,
                categoria: p.categoria,
                marca: p.marca,
                stock: p.stock
            });
        });

        let editAlmacenIndex = null;

        function actualizarSelectAlmacen() {
            const select = document.getElementById("productoAlmacen");
            select.innerHTML = "";

            productos.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.nombre;
                opt.textContent = p.nombre;
                select.appendChild(opt);
            });
        }

        function abrirModalAlmacen() {
            editAlmacenIndex = null;
            actualizarSelectAlmacen();
            document.getElementById("modalAlmacen").style.display = "block";
            document.getElementById("btnGuardarAlmacen").textContent = "Guardar";
            document.getElementById("cantidadAlmacen").value = "";
        }

        function cerrarModalAlmacen() {
            document.getElementById("modalAlmacen").style.display = "none";
        }

        function guardarStock() {
            const producto = document.getElementById("productoAlmacen").value;
            const cantidad = parseInt(document.getElementById("cantidadAlmacen").value);

            if (!producto || isNaN(cantidad)) {
                alert("Debe seleccionar un producto y colocar la cantidad");
                return;
            }

            const index = almacen.findIndex(a => a.producto === producto);

            if (index !== -1) {
                almacen[index].stock += cantidad; // Sumar stock existente
            } else {
                const p = productos.find(p => p.nombre === producto);
                almacen.push({
                    producto: p.nombre,
                    categoria: p.categoria,
                    marca: p.marca,
                    stock: cantidad
                });
            }

            cerrarModalAlmacen();
            mostrarAlmacen();
        }

        function mostrarAlmacen() {
            const tbody = document.getElementById("tablaAlmacen");
            tbody.innerHTML = "";

            almacen.forEach((a, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${a.producto}</td>
                <td>${a.categoria}</td>
                <td>${a.marca}</td>
                <td>${a.stock}</td>
                <td>
                    <button onclick="editarStock(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarStock(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        function editarStock(i) {
            const a = almacen[i];
            editAlmacenIndex = i;
            actualizarSelectAlmacen();
            document.getElementById("productoAlmacen").value = a.producto;
            document.getElementById("cantidadAlmacen").value = a.stock;
            document.getElementById("btnGuardarAlmacen").textContent = "Actualizar";
            abrirModalAlmacen();
        }

        function eliminarStock(i) {
            if (confirm("¿Eliminar este registro de stock?")) {
                almacen.splice(i, 1);
                mostrarAlmacen();
            }
        }

        // Inicializar tabla al cargar
        mostrarAlmacen();

        //-------------------------------------------------------------------------SOLICITUD DE INGRESO
        // Datos de ejemplo de solicitudes
        let solicitudes = [
            { producto: "Producto 1", cantidad: 20, solicitante: "Juan Pérez", estado: "Pendiente" },
            { producto: "Producto 2", cantidad: 10, solicitante: "María Gómez", estado: "Pendiente" }
        ];

        let editSolicitudIndex = null;

        function actualizarSelectSolicitud() {
            const select = document.getElementById("productoSolicitud");
            select.innerHTML = "";
            productos.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.nombre;
                opt.textContent = p.nombre;
                select.appendChild(opt);
            });
        }

        function abrirModalSolicitud() {
            editSolicitudIndex = null;
            actualizarSelectSolicitud();
            document.getElementById("modalSolicitud").style.display = "block";

            document.getElementById("cantidadSolicitud").value = "";
            document.getElementById("solicitanteSolicitud").value = "";
        }

        function cerrarModalSolicitud() {
            document.getElementById("modalSolicitud").style.display = "none";
        }

        function guardarSolicitud() {
            const producto = document.getElementById("productoSolicitud").value;
            const cantidad = parseInt(document.getElementById("cantidadSolicitud").value);
            const solicitante = document.getElementById("solicitanteSolicitud").value.trim();

            if (!producto || isNaN(cantidad) || !solicitante) {
                alert("Debe completar todos los campos");
                return;
            }

            const solicitud = {
                producto,
                cantidad,
                solicitante,
                estado: "Pendiente"
            };

            if (editSolicitudIndex === null) {
                solicitudes.push(solicitud);
            } else {
                solicitudes[editSolicitudIndex] = solicitud;
            }

            cerrarModalSolicitud();
            mostrarSolicitudes();
        }

        function mostrarSolicitudes() {
            const tbody = document.getElementById("tablaSolicitud");
            tbody.innerHTML = "";

            solicitudes.forEach((s, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${s.producto}</td>
                <td>${s.cantidad}</td>
                <td>${s.solicitante}</td>
                <td>${s.estado}</td>
                <td>
                    <button onclick="aprobarSolicitud(${i})" style="background:#2ecc71;color:white;border:none;padding:5px 8px;border-radius:4px;">Aprobar</button>
                    <button onclick="rechazarSolicitud(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Rechazar</button>
                    <button onclick="editarSolicitud(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                </td>
            </tr>
        `;
            });
        }

        function aprobarSolicitud(i) {
            solicitudes[i].estado = "Aprobada";

            // Actualizamos stock del almacén
            const prod = almacen.find(a => a.producto === solicitudes[i].producto);
            if (prod) prod.stock += solicitudes[i].cantidad;

            mostrarSolicitudes();
            mostrarAlmacen();
        }

        function rechazarSolicitud(i) {
            solicitudes[i].estado = "Rechazada";
            mostrarSolicitudes();
        }

        function editarSolicitud(i) {
            const s = solicitudes[i];
            editSolicitudIndex = i;
            abrirModalSolicitud();

            document.getElementById("productoSolicitud").value = s.producto;
            document.getElementById("cantidadSolicitud").value = s.cantidad;
            document.getElementById("solicitanteSolicitud").value = s.solicitante;
        }

        // Inicializar tabla al cargar con ejemplos
        mostrarSolicitudes();

        //--------------------------------------------------------------------ORDEN DE SALIDA
        let ordenes = [
            {
                destino: "Sucursal 1",
                producto: "Producto 1",
                cantidad: 5,
                usuarioEntrega: "Juan Pérez",
                usuarioAprobador: "Supervisor 1",
                fechaHora: "2025-11-19T10:00",
                observaciones: "Urgente",
                estado: "Pendiente"
            },
            {
                destino: "Vehículo 2",
                producto: "Producto 2",
                cantidad: 3,
                usuarioEntrega: "María Gómez",
                usuarioAprobador: "Supervisor 2",
                fechaHora: "2025-11-19T11:30",
                observaciones: "",
                estado: "Pendiente"
            }
        ];

        let editOrdenIndex = null;

        // Opciones de sucursal/vehículo de ejemplo
        const destinos = ["Sucursal 1", "Sucursal 2", "Sucursal 3", "Vehículo 1", "Vehículo 2"];

        function actualizarSelectOrden() {
            const prodSelect = document.getElementById("productoOrden");
            const destinoSelect = document.getElementById("destinoOrden");
            prodSelect.innerHTML = "";
            destinoSelect.innerHTML = "";

            // Productos con stock disponible
            almacen.forEach(a => {
                if (a.stock > 0) {
                    const opt = document.createElement("option");
                    opt.value = a.producto;
                    opt.textContent = `${a.producto} (Stock: ${a.stock})`;
                    prodSelect.appendChild(opt);
                }
            });

            // Destinos
            destinos.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d;
                opt.textContent = d;
                destinoSelect.appendChild(opt);
            });
        }

        function abrirModalOrden() {
            editOrdenIndex = null;
            actualizarSelectOrden();
            document.getElementById("modalOrden").style.display = "block";

            document.getElementById("cantidadOrden").value = "";
            document.getElementById("usuarioEntregaOrden").value = "";
            document.getElementById("usuarioAprobadorOrden").value = "";
            document.getElementById("fechaHoraOrden").value = "";
            document.getElementById("observacionesOrden").value = "";
        }

        function cerrarModalOrden() {
            document.getElementById("modalOrden").style.display = "none";
        }

        function guardarOrden() {
            const destino = document.getElementById("destinoOrden").value;
            const producto = document.getElementById("productoOrden").value;
            const cantidad = parseInt(document.getElementById("cantidadOrden").value);
            const usuarioEntrega = document.getElementById("usuarioEntregaOrden").value.trim();
            const usuarioAprobador = document.getElementById("usuarioAprobadorOrden").value.trim();
            const fechaHora = document.getElementById("fechaHoraOrden").value;
            const observaciones = document.getElementById("observacionesOrden").value.trim();

            if (!destino || !producto || isNaN(cantidad) || !usuarioEntrega || !usuarioAprobador || !fechaHora) {
                alert("Debe completar todos los campos obligatorios");
                return;
            }

            // Validar stock disponible
            const prodStock = almacen.find(a => a.producto === producto);
            if (cantidad > prodStock.stock) {
                alert("La cantidad solicitada excede el stock disponible");
                return;
            }

            const orden = { destino, producto, cantidad, usuarioEntrega, usuarioAprobador, fechaHora, observaciones, estado: "Pendiente" };

            if (editOrdenIndex === null) {
                ordenes.push(orden);
            } else {
                ordenes[editOrdenIndex] = orden;
            }

            cerrarModalOrden();
            mostrarOrdenes();
        }

        function mostrarOrdenes() {
            const tbody = document.getElementById("tablaOrden");
            tbody.innerHTML = "";

            ordenes.forEach((o, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${o.destino}</td>
                <td>${o.producto}</td>
                <td>${o.cantidad}</td>
                <td>${o.usuarioEntrega}</td>
                <td>${o.usuarioAprobador}</td>
                <td>${o.fechaHora}</td>
                <td>${o.observaciones}</td>
                <td>${o.estado}</td>
                <td>
                    <button onclick="aprobarOrden(${i})" style="background:#2ecc71;color:white;border:none;padding:5px 8px;border-radius:4px;">Entregar</button>
                    <button onclick="rechazarOrden(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Rechazar</button>
                    <button onclick="editarOrden(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                </td>
            </tr>
        `;
            });
        }

        function aprobarOrden(i) {
            const o = ordenes[i];
            o.estado = "Entregada";

            // Actualizar stock del almacén
            const prod = almacen.find(a => a.producto === o.producto);
            if (prod) prod.stock -= o.cantidad;

            mostrarOrdenes();
            mostrarAlmacen();
        }

        function rechazarOrden(i) {
            ordenes[i].estado = "Rechazada";
            mostrarOrdenes();
        }

        function editarOrden(i) {
            const o = ordenes[i];
            editOrdenIndex = i;
            abrirModalOrden();

            document.getElementById("destinoOrden").value = o.destino;
            document.getElementById("productoOrden").value = o.producto;
            document.getElementById("cantidadOrden").value = o.cantidad;
            document.getElementById("usuarioEntregaOrden").value = o.usuarioEntrega;
            document.getElementById("usuarioAprobadorOrden").value = o.usuarioAprobador;
            document.getElementById("fechaHoraOrden").value = o.fechaHora;
            document.getElementById("observacionesOrden").value = o.observaciones;
        }

        function filtrarOrdenes() {
            const filtro = document.getElementById("buscadorOrden").value.toLowerCase();
            const tbody = document.getElementById("tablaOrden");
            tbody.innerHTML = "";

            ordenes.forEach((o, i) => {
                if (
                    o.destino.toLowerCase().includes(filtro) ||
                    o.producto.toLowerCase().includes(filtro) ||
                    o.usuarioEntrega.toLowerCase().includes(filtro) ||
                    o.usuarioAprobador.toLowerCase().includes(filtro)
                ) {
                    tbody.innerHTML += `
                <tr>
                    <td>${o.destino}</td>
                    <td>${o.producto}</td>
                    <td>${o.cantidad}</td>
                    <td>${o.usuarioEntrega}</td>
                    <td>${o.usuarioAprobador}</td>
                    <td>${o.fechaHora}</td>
                    <td>${o.observaciones}</td>
                    <td>${o.estado}</td>
                    <td>
                        <button onclick="aprobarOrden(${i})" style="background:#2ecc71;color:white;border:none;padding:5px 8px;border-radius:4px;">Entregar</button>
                        <button onclick="rechazarOrden(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Rechazar</button>
                        <button onclick="editarOrden(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    </td>
                </tr>
            `;
                }
            });
        }


        // Inicializar tabla con ejemplos
        mostrarOrdenes();

        //--------------------------------------------------------------------ORDEN DE SALIDA


        let ventas = [];
        let ventaCounter = 1; // Para generar números de venta únicos
        let editVentaIndex = null;

        function actualizarSelectCliente() {
            const select = document.getElementById("clienteVenta");
            select.innerHTML = "";

            clientes.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.nombre;
                opt.textContent = c.nombre;
                select.appendChild(opt);
            });

            // Llenar productos
            const productosSelects = document.querySelectorAll(".productoVenta");
            productosSelects.forEach(sel => {
                sel.innerHTML = "";
                productos.forEach(p => {
                    const opt = document.createElement("option");
                    opt.value = p.nombre;
                    opt.textContent = p.nombre;
                    sel.appendChild(opt);
                });
            });
        }

        function abrirModalVenta() {
            editVentaIndex = null;
            actualizarSelectCliente();
            document.getElementById("modalVenta").style.display = "block";

            // Reset campos
            document.getElementById("empleadoVenta").value = "";
            document.getElementById("fechaHoraVenta").value = "";
            document.getElementById("descuentoVenta").value = 0;
            document.getElementById("impuestosVenta").value = 0;
            document.getElementById("totalVenta").value = 0;
            document.getElementById("estadoVenta").value = "Pendiente";

            // Reset detalle productos
            const detalleDiv = document.getElementById("detalleProductosVenta");
            detalleDiv.innerHTML = `<div style="display:flex; gap:10px; margin-bottom:10px;">
        <select class="productoVenta"></select>
        <input type="number" class="cantidadVenta" placeholder="Cantidad" min="1">
        <input type="number" class="precioVenta" placeholder="Precio Unitario" min="0">
        <button type="button" onclick="agregarDetalleProducto(this)" style="background:#3498db;color:white;border:none;padding:5px 8px;border-radius:4px;">+</button>
    </div>`;
            actualizarSelectCliente();
        }

        function cerrarModalVenta() {
            document.getElementById("modalVenta").style.display = "none";
        }

        // Agregar nueva fila de producto
        function agregarDetalleProducto(btn) {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.gap = "10px";
            div.style.marginBottom = "10px";

            div.innerHTML = `
        <select class="productoVenta"></select>
        <input type="number" class="cantidadVenta" placeholder="Cantidad" min="1">
        <input type="number" class="precioVenta" placeholder="Precio Unitario" min="0">
        <button type="button" onclick="eliminarDetalleProducto(this)" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">-</button>
    `;

            document.getElementById("detalleProductosVenta").appendChild(div);
            actualizarSelectCliente();
        }

        function eliminarDetalleProducto(btn) {
            btn.parentElement.remove();
        }

        // Calcular total
        function calcularTotal() {
            const filas = document.querySelectorAll("#detalleProductosVenta div");
            let subtotal = 0;
            filas.forEach(f => {
                const cantidad = parseFloat(f.querySelector(".cantidadVenta").value) || 0;
                const precio = parseFloat(f.querySelector(".precioVenta").value) || 0;
                subtotal += cantidad * precio;
            });
            const descuento = parseFloat(document.getElementById("descuentoVenta").value) || 0;
            const impuestos = parseFloat(document.getElementById("impuestosVenta").value) || 0;
            const total = subtotal - descuento + impuestos;
            document.getElementById("totalVenta").value = total.toFixed(2);
        }

        function guardarVenta() {
            calcularTotal();

            const cliente = document.getElementById("clienteVenta").value;
            const empleado = document.getElementById("empleadoVenta").value.trim();
            const fechaHora = document.getElementById("fechaHoraVenta").value;
            const sucursal = document.getElementById("sucursalVenta").value;
            const formaPago = document.getElementById("formaPagoVenta").value;
            const estado = document.getElementById("estadoVenta").value;
            const descuento = parseFloat(document.getElementById("descuentoVenta").value) || 0;
            const impuestos = parseFloat(document.getElementById("impuestosVenta").value) || 0;
            const total = parseFloat(document.getElementById("totalVenta").value) || 0;

            const detalle = [];
            const filas = document.querySelectorAll("#detalleProductosVenta div");
            filas.forEach(f => {
                const prod = f.querySelector(".productoVenta").value;
                const cant = parseFloat(f.querySelector(".cantidadVenta").value) || 0;
                const precio = parseFloat(f.querySelector(".precioVenta").value) || 0;
                detalle.push({ producto: prod, cantidad: cant, precioUnitario: precio, subtotal: cant * precio });
            });

            if (!cliente || !empleado || !fechaHora || detalle.length === 0) {
                alert("Complete todos los campos obligatorios y detalle de productos");
                return;
            }

            const venta = {
                nroVenta: "V-" + ventaCounter++,
                cliente,
                empleado,
                fechaHora,
                detalle,
                descuento,
                impuestos,
                total,
                sucursal,
                formaPago,
                estado
            };

            ventas.push(venta);
            cerrarModalVenta();
            mostrarVentas();
        }

        function mostrarVentas() {
            const tbody = document.getElementById("tablaVentas");
            tbody.innerHTML = "";

            ventas.forEach((v, i) => {
                const detalleStr = v.detalle.map(d => `${d.producto} (${d.cantidad} x ${d.precioUnitario})`).join(", ");
                tbody.innerHTML += `
            <tr>
                <td>${v.nroVenta}</td>
                <td>${v.cliente}</td>
                <td>${v.empleado}</td>
                <td>${v.fechaHora}</td>
                <td>${detalleStr}</td>
                <td>${v.descuento}</td>
                <td>${v.impuestos}</td>
                <td>${v.total}</td>
                <td>${v.sucursal}</td>
                <td>${v.formaPago}</td>
                <td>${v.estado}</td>
                <td>
                    <button onclick="editarVenta(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarVenta(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        // Filtrar ventas
        function filtrarVentas() {
            const filtro = document.getElementById("buscadorVenta").value.toLowerCase();
            const tbody = document.getElementById("tablaVentas");
            tbody.innerHTML = "";

            ventas.forEach((v, i) => {
                if (v.nroVenta.toLowerCase().includes(filtro) ||
                    v.cliente.toLowerCase().includes(filtro) ||
                    v.empleado.toLowerCase().includes(filtro) ||
                    v.estado.toLowerCase().includes(filtro)) {
                    const detalleStr = v.detalle.map(d => `${d.producto} (${d.cantidad} x ${d.precioUnitario})`).join(", ");
                    tbody.innerHTML += `
                <tr>
                    <td>${v.nroVenta}</td>
                    <td>${v.cliente}</td>
                    <td>${v.empleado}</td>
                    <td>${v.fechaHora}</td>
                    <td>${detalleStr}</td>
                    <td>${v.descuento}</td>
                    <td>${v.impuestos}</td>
                    <td>${v.total}</td>
                    <td>${v.sucursal}</td>
                    <td>${v.formaPago}</td>
                    <td>${v.estado}</td>
                    <td>
                        <button onclick="editarVenta(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                        <button onclick="eliminarVenta(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                    </td>
                </tr>
            `;
                }
            });
        }
        // Ejemplos de ventas precargadas
        ventas = [
            {
                nroVenta: "V-1",
                cliente: "Juan Pérez",
                empleado: "Empleado 1",
                fechaHora: "2025-11-19<br>09:30",
                detalle: [
                    { producto: "Producto 1", cantidad: 2, precioUnitario: 50, subtotal: 100 },
                    { producto: "Producto 2", cantidad: 1, precioUnitario: 75, subtotal: 75 }
                ],
                descuento: 10,
                impuestos: 20,
                total: 185,
                sucursal: "Sucursal 1",
                formaPago: "Efectivo",
                estado: "Pendiente"
            },
            {
                nroVenta: "V-2",
                cliente: "María Gómez",
                empleado: "Empleado 2",
                fechaHora: "2025-11-19<br>10:15",
                detalle: [
                    { producto: "Producto 3", cantidad: 3, precioUnitario: 30, subtotal: 90 },
                    { producto: "Producto 1", cantidad: 1, precioUnitario: 50, subtotal: 50 }
                ],
                descuento: 0,
                impuestos: 14,
                total: 154,
                sucursal: "Sucursal 2",
                formaPago: "QR",
                estado: "Confirmado"
            }
        ];

        // Inicializamos el contador de ventas para no repetir números
        ventaCounter = ventas.length + 1;

        // Mostrar tabla al cargar
        mostrarVentas();

        //----------------------------------------------------------------DEVOLUCIONES 
        let devoluciones = [];
        let devolucionCounter = 1;

        // Actualizar select de clientes y productos
        function actualizarSelectClienteDevolucion() {
            const selectCliente = document.getElementById("clienteDevolucion");
            selectCliente.innerHTML = "";
            clientes.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.nombre;
                opt.textContent = c.nombre;
                selectCliente.appendChild(opt);
            });

            const productosSelects = document.querySelectorAll(".productoDevolucion");
            productosSelects.forEach(sel => {
                sel.innerHTML = "";
                productos.forEach(p => {
                    const opt = document.createElement("option");
                    opt.value = p.nombre;
                    opt.textContent = p.nombre;
                    sel.appendChild(opt);
                });
            });
        }

        function abrirModalDevolucion() {
            devolucionCounter++;
            actualizarSelectClienteDevolucion();
            document.getElementById("modalDevolucion").style.display = "block";

            // Reset campos
            document.getElementById("usuarioAprobadorDevolucion").value = "";
            document.getElementById("fechaHoraDevolucion").value = "";
            document.getElementById("observacionesDevolucion").value = "";
            document.getElementById("estadoDevolucion").value = "Pendiente";

            // Reset detalle productos
            document.getElementById("detalleProductosDevolucion").innerHTML = `<div style="display:flex; gap:10px; margin-bottom:10px;">
        <select class="productoDevolucion"></select>
        <input type="number" class="cantidadDevolucion" placeholder="Cantidad" min="1">
        <button type="button" onclick="agregarDetalleProductoDevolucion(this)" style="background:#3498db;color:white;border:none;padding:5px 8px;border-radius:4px;">+</button>
    </div>`;
            actualizarSelectClienteDevolucion();
        }

        function cerrarModalDevolucion() {
            document.getElementById("modalDevolucion").style.display = "none";
        }

        // Agregar nueva fila de productos
        function agregarDetalleProductoDevolucion(btn) {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.gap = "10px";
            div.style.marginBottom = "10px";

            div.innerHTML = `
        <select class="productoDevolucion"></select>
        <input type="number" class="cantidadDevolucion" placeholder="Cantidad" min="1">
        <button type="button" onclick="eliminarDetalleProductoDevolucion(this)" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">-</button>
    `;
            document.getElementById("detalleProductosDevolucion").appendChild(div);
            actualizarSelectClienteDevolucion();
        }

        function eliminarDetalleProductoDevolucion(btn) {
            btn.parentElement.remove();
        }

        // Guardar devolución
        function guardarDevolucion() {
            const cliente = document.getElementById("clienteDevolucion").value;
            const usuario = document.getElementById("usuarioAprobadorDevolucion").value.trim();
            const fechaHora = document.getElementById("fechaHoraDevolucion").value;
            const observaciones = document.getElementById("observacionesDevolucion").value;
            const estado = document.getElementById("estadoDevolucion").value;

            const detalle = [];
            const filas = document.querySelectorAll("#detalleProductosDevolucion div");
            filas.forEach(f => {
                const prod = f.querySelector(".productoDevolucion").value;
                const cant = parseFloat(f.querySelector(".cantidadDevolucion").value) || 0;
                detalle.push({ producto: prod, cantidad: cant });
            });

            if (!cliente || !usuario || !fechaHora || detalle.length === 0) {
                alert("Complete todos los campos obligatorios y detalle de productos");
                return;
            }

            const devolucion = {
                nroDevolucion: "D-" + devolucionCounter,
                cliente,
                detalle,
                usuario,
                fechaHora,
                observaciones,
                estado
            };

            devoluciones.push(devolucion);
            cerrarModalDevolucion();
            mostrarDevoluciones();
        }

        // Mostrar devoluciones en tabla
        function mostrarDevoluciones() {
            const tbody = document.getElementById("tablaDevoluciones");
            tbody.innerHTML = "";

            devoluciones.forEach((d, i) => {
                const detalleStr = d.detalle.map(p => `${p.producto} (${p.cantidad})`).join(", ");
                tbody.innerHTML += `
            <tr>
                <td>${d.nroDevolucion}</td>
                <td>${d.cliente}</td>
                <td>${detalleStr}</td>
                <td>${d.usuario}</td>
                <td>${d.fechaHora}</td>
                <td>${d.observaciones}</td>
                <td>${d.estado}</td>
                <td>
                    <button onclick="editarDevolucion(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarDevolucion(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        // Filtrar devoluciones
        function filtrarDevoluciones() {
            const filtro = document.getElementById("buscadorDevolucion").value.toLowerCase();
            const tbody = document.getElementById("tablaDevoluciones");
            tbody.innerHTML = "";

            devoluciones.forEach((d, i) => {
                if (d.nroDevolucion.toLowerCase().includes(filtro) ||
                    d.cliente.toLowerCase().includes(filtro) ||
                    d.estado.toLowerCase().includes(filtro)) {
                    const detalleStr = d.detalle.map(p => `${p.producto} (${p.cantidad})`).join(", ");
                    tbody.innerHTML += `
                <tr>
                    <td>${d.nroDevolucion}</td>
                    <td>${d.cliente}</td>
                    <td>${detalleStr}</td>
                    <td>${d.usuario}</td>
                    <td>${d.fechaHora}</td>
                    <td>${d.observaciones}</td>
                    <td>${d.estado}</td>
                    <td>
                        <button onclick="editarDevolucion(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                        <button onclick="eliminarDevolucion(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                    </td>
                </tr>
            `;
                }
            });
        }

        // Ejemplos precargados
        devoluciones = [
            {
                nroDevolucion: "D-1",
                cliente: "Juan Pérez",
                detalle: [
                    { producto: "Producto 1", cantidad: 1 },
                    { producto: "Producto 2", cantidad: 2 }
                ],
                usuario: "Supervisor 1",
                fechaHora: "2025-11-19T11:00",
                observaciones: "Producto defectuoso",
                estado: "Pendiente"
            },
            {
                nroDevolucion: "D-2",
                cliente: "María Gómez",
                detalle: [
                    { producto: "Producto 3", cantidad: 1 }
                ],
                usuario: "Supervisor 2",
                fechaHora: "2025-11-19T12:30",
                observaciones: "Cambio de talla",
                estado: "Aprobada"
            }
        ];

        devolucionCounter = devoluciones.length + 1;
        mostrarDevoluciones();

        //-----------------------------------------------------------SUCURSALES
        let sucursales = [];
        let sucursalCounter = 1;

        // Abrir modal
        function abrirModalSucursal() {
            document.getElementById("modalSucursal").style.display = "block";
            document.getElementById("nombreSucursal").value = "";
            document.getElementById("direccionSucursal").value = "";
            document.getElementById("ciudadSucursal").value = "La Paz";
            document.getElementById("vehiculosSucursal").innerHTML = `<div style="display:flex; gap:10px; margin-bottom:10px;">
        <input type="text" class="vehiculoSucursal" placeholder="Nombre / Matrícula">
        <button type="button" onclick="agregarVehiculoSucursal(this)" style="background:#3498db;color:white;border:none;padding:5px 8px;border-radius:4px;">+</button>
    </div>`;
        }

        // Cerrar modal
        function cerrarModalSucursal() {
            document.getElementById("modalSucursal").style.display = "none";
        }

        // Agregar fila de vehículo
        function agregarVehiculoSucursal(btn) {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.gap = "10px";
            div.style.marginBottom = "10px";

            div.innerHTML = `
        <input type="text" class="vehiculoSucursal" placeholder="Nombre / Matrícula">
        <button type="button" onclick="eliminarVehiculoSucursal(this)" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">-</button>
    `;
            document.getElementById("vehiculosSucursal").appendChild(div);
        }

        function eliminarVehiculoSucursal(btn) {
            btn.parentElement.remove();
        }

        // Guardar sucursal
        function guardarSucursal() {
            const nombre = document.getElementById("nombreSucursal").value.trim();
            const direccion = document.getElementById("direccionSucursal").value.trim();
            const ciudad = document.getElementById("ciudadSucursal").value;

            const vehiculos = Array.from(document.querySelectorAll(".vehiculoSucursal")).map(v => v.value.trim()).filter(v => v !== "");

            if (!nombre || !direccion || vehiculos.length === 0) {
                alert("Complete todos los campos obligatorios y agregue al menos un vehículo");
                return;
            }

            const sucursal = {
                nombre,
                direccion,
                ciudad,
                vehiculos
            };

            sucursales.push(sucursal);
            cerrarModalSucursal();
            mostrarSucursales();
        }

        // Mostrar sucursales en tabla
        function mostrarSucursales() {
            const tbody = document.getElementById("tablaSucursales");
            tbody.innerHTML = "";

            sucursales.forEach((s, i) => {
                tbody.innerHTML += `
            <tr>
                <td>${s.nombre}</td>
                <td>${s.direccion}</td>
                <td>${s.ciudad}</td>
                <td>${s.vehiculos.join(", ")}</td>
                <td>
                    <button onclick="editarSucursal(${i})" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
                    <button onclick="eliminarSucursal(${i})" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">Eliminar</button>
                </td>
            </tr>
        `;
            });
        }

        // Editar sucursal
        function editarSucursal(index) {
            const suc = sucursales[index];
            abrirModalSucursal();
            document.getElementById("nombreSucursal").value = suc.nombre;
            document.getElementById("direccionSucursal").value = suc.direccion;
            document.getElementById("ciudadSucursal").value = suc.ciudad;

            // Limpiar vehículos y agregar existentes
            const vehiculosDiv = document.getElementById("vehiculosSucursal");
            vehiculosDiv.innerHTML = "";
            suc.vehiculos.forEach(v => {
                const div = document.createElement("div");
                div.style.display = "flex";
                div.style.gap = "10px";
                div.style.marginBottom = "10px";
                div.innerHTML = `<input type="text" class="vehiculoSucursal" value="${v}">
                         <button type="button" onclick="eliminarVehiculoSucursal(this)" style="background:#e74c3c;color:white;border:none;padding:5px 8px;border-radius:4px;">-</button>`;
                vehiculosDiv.appendChild(div);
            });

            // Cambiar botón guardar para actualizar
            const btnGuardar = document.querySelector("#modalSucursal .btn");
            btnGuardar.textContent = "Actualizar";
            btnGuardar.onclick = function () {
                sucursales[index].nombre = document.getElementById("nombreSucursal").value.trim();
                sucursales[index].direccion = document.getElementById("direccionSucursal").value.trim();
                sucursales[index].ciudad = document.getElementById("ciudadSucursal").value;
                sucursales[index].vehiculos = Array.from(document.querySelectorAll(".vehiculoSucursal")).map(v => v.value.trim()).filter(v => v !== "");
                mostrarSucursales();
                cerrarModalSucursal();
                btnGuardar.textContent = "Guardar";
                btnGuardar.onclick = guardarSucursal;
            };
        }

        // Eliminar sucursal
        function eliminarSucursal(index) {
            if (confirm("¿Desea eliminar esta sucursal?")) {
                sucursales.splice(index, 1);
                mostrarSucursales();
            }
        }

        // Ejemplos precargados
        sucursales = [
            { nombre: "Sucursal 1", direccion: "Av. Principal 123", ciudad: "La Paz", vehiculos: ["Vehículo A", "Vehículo B"] },
            { nombre: "Sucursal 2", direccion: "Calle Secundaria 45", ciudad: "El Alto", vehiculos: ["Vehículo C"] },
            { nombre: "Sucursal 3", direccion: "Av. Central 78", ciudad: "La Paz", vehiculos: ["Vehículo D", "Vehículo E", "Vehículo F"] }
        ];

        mostrarSucursales();

        //------------------------------------------------------------------CONFIGURACIONES
        // Configuración inicial del sistema
        let configuracionSistema = {
            nombreSistema: "Sistema de Gestión de Ventas",
            moneda: "Bs.",
            iva: 13,
            formasPago: ["Efectivo", "QR", "Transferencia"],
            notificaciones: ["Correo", "WhatsApp"]
        };

        // Abrir modal
        function abrirModalConfiguracion() {
            document.getElementById("modalConfiguracion").style.display = "block";

            // Rellenar campos con datos actuales
            document.getElementById("nombreSistema").value = configuracionSistema.nombreSistema;
            document.getElementById("monedaSistema").value = configuracionSistema.moneda;
            document.getElementById("ivaSistema").value = configuracionSistema.iva;
            document.getElementById("formasPagoSistema").value = configuracionSistema.formasPago.join(", ");
            document.getElementById("notificacionSistema").value = configuracionSistema.notificaciones.join(", ");
        }

        // Cerrar modal
        function cerrarModalConfiguracion() {
            document.getElementById("modalConfiguracion").style.display = "none";
        }

        // Guardar configuración
        function guardarConfiguracion() {
            configuracionSistema.nombreSistema = document.getElementById("nombreSistema").value.trim();
            configuracionSistema.moneda = document.getElementById("monedaSistema").value.trim();
            configuracionSistema.iva = parseFloat(document.getElementById("ivaSistema").value) || 0;
            configuracionSistema.formasPago = document.getElementById("formasPagoSistema").value.split(",").map(f => f.trim()).filter(f => f !== "");
            configuracionSistema.notificaciones = document.getElementById("notificacionSistema").value.split(",").map(n => n.trim()).filter(n => n !== "");

            cerrarModalConfiguracion();
            mostrarConfiguracion();
        }

        // Mostrar configuración en tabla
        function mostrarConfiguracion() {
            const tbody = document.getElementById("tablaConfiguracion");
            tbody.innerHTML = `
        <tr>
            <td>${configuracionSistema.nombreSistema}</td>
            <td>${configuracionSistema.moneda}</td>
            <td>${configuracionSistema.iva}%</td>
            <td>${configuracionSistema.formasPago.join(", ")}</td>
            <td>${configuracionSistema.notificaciones.join(", ")}</td>
        </tr>
    `;
        }

        // Inicializar tabla
        mostrarConfiguracion();
        //----------------------------------------------------------------AJUSTES DE USUARIO
        // Datos de ejemplo de usuario
        let usuarioActual = {
            nombre: "Juan Pérez",
            email: "juan.perez@email.com",
            pass: "123456",
            idioma: "Español",
            notificaciones: ["Correo", "WhatsApp"]
        };

        // Abrir modal usuario
        function abrirModalUsuario() {
            document.getElementById("modalUsuario").style.display = "block";

            document.getElementById("nombreUsuario").value = usuarioActual.nombre;
            document.getElementById("emailUsuario").value = usuarioActual.email;
            document.getElementById("passUsuario").value = usuarioActual.pass;
            document.getElementById("idiomaUsuario").value = usuarioActual.idioma;
            document.getElementById("notificacionUsuario").value = usuarioActual.notificaciones.join(", ");
        }

        // Cerrar modal
        function cerrarModalUsuario() {
            document.getElementById("modalUsuario").style.display = "none";
        }

        // Guardar ajustes
        function guardarUsuario() {
            usuarioActual.nombre = document.getElementById("nombreUsuario").value.trim();
            usuarioActual.email = document.getElementById("emailUsuario").value.trim();
            usuarioActual.pass = document.getElementById("passUsuario").value;
            usuarioActual.idioma = document.getElementById("idiomaUsuario").value;
            usuarioActual.notificaciones = document.getElementById("notificacionUsuario").value.split(",").map(n => n.trim()).filter(n => n !== "");

            cerrarModalUsuario();
            mostrarUsuario();
        }

        // Mostrar usuario en tabla
        function mostrarUsuario() {
            const tbody = document.getElementById("tablaUsuarios");
            tbody.innerHTML = `
        <tr>
            <td>${usuarioActual.nombre}</td>
            <td>${usuarioActual.email}</td>
            <td>${usuarioActual.idioma}</td>
            <td>${usuarioActual.notificaciones.join(", ")}</td>
            <td>
                <button onclick="abrirModalUsuario()" style="background:#f39c12;color:white;border:none;padding:5px 8px;border-radius:4px;">Editar</button>
            </td>
        </tr>
    `;
        }

        // Inicializar tabla
        mostrarUsuario();

        //---------------------------------------------------------------------------------REPORTES 
        // Datos de ejemplo de reportes
        let datosReporte = [
            { producto: "Producto A", sucursal: "Sucursal 1", tipo: "Entrada", cantidad: 10, fecha: "2025-11-19T08:30", usuario: "Juan Pérez", motivo: "", estado: "Registrado" },
            { producto: "Producto B", sucursal: "Sucursal 2", tipo: "Salida", cantidad: 5, fecha: "2025-11-19T09:00", usuario: "María López", motivo: "Pedido Cliente", estado: "Confirmado" },
            { producto: "Producto A", sucursal: "Sucursal 1", tipo: "Ajuste", cantidad: 2, fecha: "2025-11-18T14:15", usuario: "Carlos Díaz", motivo: "Inventario", estado: "Anulado" }
        ];

        // Mostrar reporte en tabla
        function mostrarReporteAvanzado(datos) {
            const tbody = document.getElementById("tbodyReporteAvanzado");
            tbody.innerHTML = datos.map(d => `
        <tr>
            <td>${d.producto}</td>
            <td>${d.sucursal}</td>
            <td>${d.tipo}</td>
            <td>${d.cantidad}</td>
            <td>${d.fecha.replace("T", " ")}</td>
            <td>${d.usuario}</td>
            <td>${d.motivo}</td>
            <td>${d.estado}</td>
        </tr>
    `).join('');
        }

        // Aplicar filtros
        function aplicarFiltros() {
            const producto = document.getElementById("filtroProducto").value;
            const sucursal = document.getElementById("filtroSucursal").value;
            const tipo = document.getElementById("filtroMovimiento").value;
            const estado = document.getElementById("filtroEstado").value;
            const fechaDesde = document.getElementById("filtroFechaDesde").value;
            const fechaHasta = document.getElementById("filtroFechaHasta").value;

            const filtrados = datosReporte.filter(d => {
                return (!producto || d.producto === producto) &&
                    (!sucursal || d.sucursal === sucursal) &&
                    (!tipo || d.tipo === tipo) &&
                    (!estado || d.estado === estado) &&
                    (!fechaDesde || new Date(d.fecha) >= new Date(fechaDesde)) &&
                    (!fechaHasta || new Date(d.fecha) <= new Date(fechaHasta));
            });

            mostrarReporteAvanzado(filtrados);
        }

        // Inicializar
        mostrarReporteAvanzado(datosReporte);

        // Exportar CSV
        function exportarCSV() {
            let csv = "Producto,Sucursal,Tipo Movimiento,Cantidad,Fecha y Hora,Usuario Responsable,Motivo,Estado\n";
            datosReporte.forEach(d => {
                csv += `${d.producto},${d.sucursal},${d.tipo},${d.cantidad},${d.fecha},${d.usuario},${d.motivo},${d.estado}\n`;
            });
            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "reporte.csv";
            link.click();
        }

        // Exportar Excel (simple, usando CSV renombrado)
        function exportarExcel() {
            exportarCSV(); // En navegador básico podemos usar CSV con extensión .xls
        }

        // Exportar PDF (simple, con jsPDF)
        function exportarPDF() {
            if (typeof jsPDF === "undefined") {
                alert("Incluir jsPDF para exportar PDF");
                return;
            }
            const doc = new jsPDF();
            let y = 10;
            doc.text("Reporte Avanzado", 10, y);
            y += 10;
            datosReporte.forEach(d => {
                doc.text(`${d.fecha} | ${d.producto} | ${d.sucursal} | ${d.tipo} | ${d.cantidad} | ${d.usuario} | ${d.motivo} | ${d.estado}`, 10, y);
                y += 10;
            });
            doc.save("reporte.pdf");
        }