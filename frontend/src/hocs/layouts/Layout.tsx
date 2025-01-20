import { connect } from "react-redux";
import { ReactNode } from "react";
import { motion } from "framer-motion";
// Defino las propiedades esperadas para este componente.
// Esto incluye los hijos que se renderizarán dentro del layout.
interface LayoutProps {
  children: ReactNode; // Declaro que `children` puede ser cualquier nodo React válido.
}

// Este componente es un layout básico que envuelve a los hijos que se le pasen.
// Esto me permite cargar el estado en toda la página mediante Redux.
function Layout({ children }: LayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0.5 } }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Renderizo los elementos hijos que se pasen a este layout */}
      {children}
    </motion.div>
  );
}

// Conecto el estado global de Redux al componente.
// Actualmente no mapeo ninguna parte del estado, pero esto me deja preparado
// para cuando necesite acceder al estado global en el futuro.
const mapStateToProps = () => ({
  // Aquí podría mapear propiedades del estado global si las necesitara.
});

export default connect(mapStateToProps, {
  // Aunque no estoy pasando acciones aquí, la conexión con Redux está lista para futuras necesidades.
})(Layout);
