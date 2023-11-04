import { CsvColumn } from '~/data/models/csv';
import Dialog from '../Dialog';

interface ProfileEditDialogProps {
	action: 'create' | 'edit';
	columns?: CsvColumn[];
	name?: string;
}

const ProfileEditDialog = ({
	action,
	columns,
	name = '',
}: ProfileEditDialogProps) => {
	return (
		<Dialog title={action === 'create' ? 'New Profile' : 'Edit Profile'}>
			<input type="text" value={name} />
			<div>
				{columns?.map((col) => {
					const { name, ordinal, visible } = col;
					return (
						<p key={name}>
							{name}
							<ul>
								<li>ordinal: {ordinal}</li>
								<li>visible: {visible.toString()}</li>
							</ul>
						</p>
					);
				})}
			</div>
			<div className="flex">
				<button className="bg-red-500" type="button">
					Save
				</button>
			</div>
		</Dialog>
	);
};

export default ProfileEditDialog;
