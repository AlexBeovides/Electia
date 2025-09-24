import "../styles/Card.scss";
import "../styles/CourseCard.scss"; 

interface CardProps {
  id: number;
  name: string;
  center: string;
  url: string;
}

export const EnrolledCourseCard = (props: CardProps) => {
  const propId = props.id;
  const propName = props.name;
  const propCenter = props.center;
  const propUrl = props.url;
  

  return (
    <a href={`${window.location.origin}/electia-app/enrolled-courses/?courseId=${propId}`}>
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
            <div className="bottom-row">{propCenter}</div>
          </div>
        </div>
      </div>
    </a>
  );
};