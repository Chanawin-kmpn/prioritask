import { CircleHelpIcon } from 'lucide-react';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

const PriorityInfo = () => {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<CircleHelpIcon />
			</HoverCardTrigger>
			<HoverCardContent className="w-80 space-y-4 px-8" align="start">
				<div>
					<p className="text-lg">Priority in Eisenhower Matrix</p>
					<p>
						<strong>Eisenhower Matrix</strong> categorizes tasks into four
						quadrants based on importance (Important) and urgency (Urgent):
					</p>
				</div>

				<ol className="list-decimal space-y-2">
					<li>
						Do (Urgent and Important):{' '}
						<ul className="list-inside list-disc">
							<li className="text-sm">
								Tasks that are both important and urgent. Complete these
								immediately due to their high impact.
							</li>
						</ul>
					</li>

					<li>
						Schedule (Important but Not Urgent):{' '}
						<ul className="list-inside list-disc">
							<li className="text-sm">
								Tasks that are important but can be scheduled for later.
							</li>
						</ul>
					</li>
					<li>
						Delegate (Urgent but Not Important):{' '}
						<ul className="list-inside list-disc">
							<li className="text-sm">
								Tasks that are urgent but can be delegated to others.
							</li>
						</ul>
					</li>
					<li>
						Delete (Not Urgent and Not Important):{' '}
						<ul className="list-inside list-disc">
							<li className="text-sm">
								Tasks that are neither urgent nor important. These can often be
								eliminated.
							</li>
						</ul>
					</li>
				</ol>
			</HoverCardContent>
		</HoverCard>
	);
};

export default PriorityInfo;
