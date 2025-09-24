import "../styles/Card.scss";
import "../styles/CourseCard.scss"; 

interface CardProps {
  id: number;
  name: string;
  center: string;
  url: string;
  startDate: Date;
  endDate: Date;
}

// Función para formatear fechas
const formatDate = (date: Date | string): string => {
  const validDate = typeof date === "string" ? new Date(date) : date;
  return validDate.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const CourseInstanceCard = (props: CardProps) => {
  const propId = props.id;
  const propName = props.name;
  const propCenter = props.center;
  const propUrl = props.url;
  const propStartDate = props.startDate;
  const propEndDate = props.endDate;

  return (
    <a href={`${window.location.origin}/electia-app/courses/?courseId=${propId}`}>
      <div className="card">
        <div className="card__image-container">
          <div
            className="card__image"
            style={{ backgroundImage: `url(${propUrl})` }}
          ></div>
          {/* <img src={`${propUrl}`} alt="Salad" width="500" height="333" /> */}
        </div>
        <div className="card__info">
          <div className="car__info--title">
            <h3>{propName}</h3>
            
            <div className="bottom-row">
              🗓️{`${formatDate(propStartDate)} - ${formatDate(propEndDate)}`}
              <br></br>
              📍{propCenter}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};