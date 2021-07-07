import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';

export default function PlayerCard({competitor}) {
    return (
        <Card>
            <CardContent>
                <Link to={`/user/${competitor.id}`}>
                    {competitor.tag}
                </Link>
            </CardContent>
        </Card>
    );
}